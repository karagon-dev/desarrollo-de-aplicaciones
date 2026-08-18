/*
  SKAMA - RF-004 (calificacion) + visibilidad de stock + RF-017 (alertas).

  Ejecutar este archivo UNA vez contra la base existente (skama-db).
  Orden interno: constraints primero, stored procedures despues.
  Es seguro reejecutarlo (IF EXISTS + CREATE OR ALTER).
*/

/* -------------------------------------------------------------------------- */
/* 1. Review: una calificacion por usuario + producto + orden                 */
/* -------------------------------------------------------------------------- */

IF OBJECT_ID('dbo.UQ_Reviews_User_Product', 'UQ') IS NOT NULL
BEGIN
    ALTER TABLE dbo.Review
    DROP CONSTRAINT UQ_Reviews_User_Product;
END;
GO

IF OBJECT_ID('dbo.UQ_Reviews_User_Product_Order', 'UQ') IS NULL
BEGIN
    ALTER TABLE dbo.Review
    ADD CONSTRAINT UQ_Reviews_User_Product_Order
        UNIQUE (TID_UserId, TID_ProductId, TID_OrderId);
END;
GO

/* -------------------------------------------------------------------------- */
/* 2. EmailNotification: permitir LOW_STOCK_ALERT                             */
/*    Debe existir ANTES de usp_Order_CreateFromCart.                         */
/* -------------------------------------------------------------------------- */

IF OBJECT_ID('dbo.CK_EmailNotifications_Type', 'C') IS NOT NULL
BEGIN
    ALTER TABLE dbo.EmailNotification
    DROP CONSTRAINT CK_EmailNotifications_Type;
END;
GO

IF OBJECT_ID('dbo.CK_EmailNotifications_Type', 'C') IS NULL
BEGIN
    ALTER TABLE dbo.EmailNotification
    ADD CONSTRAINT CK_EmailNotifications_Type
        CHECK (TC_Type IN ('ORDER_CONFIRMATION', 'ORDER_STATUS_UPDATE', 'PASSWORD_RESET', 'LOW_STOCK_ALERT'));
END;
GO

/* -------------------------------------------------------------------------- */
/* 3. Stored procedures (CREATE OR ALTER, no dependen entre si)               */
/* -------------------------------------------------------------------------- */

CREATE OR ALTER PROCEDURE dbo.usp_EmailNotification_Insert
    @UserId UNIQUEIDENTIFIER,
    @OrderId UNIQUEIDENTIFIER = NULL,
    @Type NVARCHAR(50),
    @RecipientEmail NVARCHAR(150),
    @Subject NVARCHAR(255),
    @NewId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF @Type NOT IN ('ORDER_CONFIRMATION', 'ORDER_STATUS_UPDATE', 'PASSWORD_RESET', 'LOW_STOCK_ALERT')
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    SET @NewId = NEWID();

    INSERT INTO dbo.EmailNotification
    (
        TID_Id,
        TID_UserId,
        TID_OrderId,
        TC_Type,
        TC_RecipientEmail,
        TC_Subject,
        TC_Status
    )
    VALUES
    (
        @NewId,
        @UserId,
        @OrderId,
        @Type,
        @RecipientEmail,
        @Subject,
        'PENDING'
    );

    SET @ResultCode = 0;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Review_Insert
    @UserId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @OrderId UNIQUEIDENTIFIER,
    @Rating INT,
    @Comment NVARCHAR(1000) = NULL,
    @NewId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF @Rating < 1 OR @Rating > 5
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    IF EXISTS (
        SELECT 1 FROM dbo.Review
        WHERE TID_UserId = @UserId AND TID_ProductId = @ProductId AND TID_OrderId = @OrderId
    )
    BEGIN
        SET @ResultCode = 3;
        RETURN;
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.OrderItem OI
        INNER JOIN dbo.[Order] O ON O.TID_Id = OI.TID_OrderId
        WHERE O.TID_Id = @OrderId
          AND O.TID_UserId = @UserId
          AND OI.TID_ProductId = @ProductId
          AND O.TC_Status IN ('PAID', 'SHIPPED', 'DELIVERED')
    )
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    SET @NewId = NEWID();

    INSERT INTO dbo.Review
    (
        TID_Id,
        TID_UserId,
        TID_ProductId,
        TID_OrderId,
        TN_Rating,
        TC_Comment
    )
    VALUES
    (
        @NewId,
        @UserId,
        @ProductId,
        @OrderId,
        @Rating,
        @Comment
    );

    SET @ResultCode = 0;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Product_GetAll
    @Search NVARCHAR(150) = NULL,
    @CategoryId UNIQUEIDENTIFIER = NULL,
    @IncludeInactive BIT = 0,
    @IncludeUnavailable BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.TID_Id AS Id,
        P.TID_CategoryId AS CategoryId,
        C.TC_Name AS CategoryName,
        P.TC_Name AS Name,
        P.TC_Description AS Description,
        P.TN_Price AS Price,
        P.TN_StockQuantity AS StockQuantity,
        P.TN_MinimumStock AS MinimumStock,
        P.TB_IsLimitedEdition AS IsLimitedEdition,
        P.TB_IsActive AS IsActive,
        P.TD_CreatedAt AS CreatedAt,
        P.TD_UpdatedAt AS UpdatedAt
    FROM dbo.Product P
    INNER JOIN dbo.Category C ON C.TID_Id = P.TID_CategoryId
    WHERE
        (@IncludeInactive = 1 OR P.TB_IsActive = 1)
        AND (@IncludeUnavailable = 1 OR P.TN_StockQuantity > 0)
        AND (@CategoryId IS NULL OR P.TID_CategoryId = @CategoryId)
        AND (
            @Search IS NULL
            OR P.TC_Name LIKE '%' + @Search + '%'
            OR P.TC_Description LIKE '%' + @Search + '%'
            OR C.TC_Name LIKE '%' + @Search + '%'
        )
    ORDER BY P.TC_Name;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Report_SalesByProduct
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        OI.TID_ProductId AS ProductId,
        OI.TC_ProductName AS ProductName,
        MAX(COALESCE(
            ParsedOrder.BuyerName,
            NULLIF(LTRIM(RTRIM(CP.TC_FirstName + ' ' + CP.TC_LastName)), ''),
            U.TC_Email
        )) AS BuyerName,
        U.TC_Email AS CustomerEmail,
        SUM(OI.TN_Quantity) AS TotalQuantitySold,
        COUNT(DISTINCT O.TID_Id) AS OrderCount,
        SUM(OI.TN_LineTotal) AS TotalSales,
        AVG(CAST(R.TN_Rating AS DECIMAL(4,2))) AS AverageRating
    FROM dbo.OrderItem OI
    INNER JOIN dbo.[Order] O ON O.TID_Id = OI.TID_OrderId
    INNER JOIN dbo.[User] U ON U.TID_Id = O.TID_UserId
    LEFT JOIN dbo.CustomerProfile CP ON CP.TID_UserId = U.TID_Id
    LEFT JOIN dbo.Review R
        ON R.TID_OrderId = O.TID_Id
        AND R.TID_ProductId = OI.TID_ProductId
        AND R.TID_UserId = O.TID_UserId
    OUTER APPLY
    (
        SELECT BuyerSegment =
            CASE
                WHEN CHARINDEX('Cliente:', O.TC_ShippingAddress) > 0 THEN
                    LTRIM(RTRIM(SUBSTRING(
                        O.TC_ShippingAddress,
                        CHARINDEX('Cliente:', O.TC_ShippingAddress) + LEN('Cliente:'),
                        LEN(O.TC_ShippingAddress)
                    )))
                ELSE NULL
            END
    ) OrderDetail
    OUTER APPLY
    (
        SELECT BuyerName =
            NULLIF(LTRIM(RTRIM(
                CASE
                    WHEN OrderDetail.BuyerSegment IS NULL THEN NULL
                    WHEN CHARINDEX('|', OrderDetail.BuyerSegment) > 0 THEN
                        LEFT(OrderDetail.BuyerSegment, CHARINDEX('|', OrderDetail.BuyerSegment) - 1)
                    ELSE OrderDetail.BuyerSegment
                END
            )), '')
    ) ParsedOrder
    WHERE CAST(O.TD_CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate
      AND O.TC_Status IN ('PAID', 'SHIPPED', 'DELIVERED')
    GROUP BY
        OI.TID_ProductId,
        OI.TC_ProductName,
        U.TC_Email
    ORDER BY TotalSales DESC, TotalQuantitySold DESC, OI.TC_ProductName ASC, U.TC_Email ASC;
END;
GO

/* -------------------------------------------------------------------------- */
/* 4. Crear orden desde carrito (usa Review + LOW_STOCK_ALERT + inventario)   */
/* -------------------------------------------------------------------------- */

CREATE OR ALTER PROCEDURE dbo.usp_Order_CreateFromCart
    @CartId UNIQUEIDENTIFIER,
    @PaymentMethod NVARCHAR(50),
    @ShippingAddress NVARCHAR(500),
    @ProductRatings NVARCHAR(MAX) = NULL,
    @OrderId UNIQUEIDENTIFIER OUTPUT,
    @OrderNumber NVARCHAR(50) OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UserId UNIQUEIDENTIFIER;
    DECLARE @Subtotal DECIMAL(10,2);
    DECLARE @HasProductRatings BIT =
        CASE WHEN NULLIF(LTRIM(RTRIM(ISNULL(@ProductRatings, N''))), N'') IS NULL THEN 0 ELSE 1 END;
    DECLARE @CartItems TABLE
    (
        ProductId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        ProductName NVARCHAR(150) NOT NULL,
        Quantity INT NOT NULL,
        UnitPrice DECIMAL(10,2) NOT NULL,
        PreviousStock INT NOT NULL,
        NewStock INT NOT NULL,
        IsActive BIT NOT NULL
    );
    DECLARE @RawRatings TABLE
    (
        ProductId UNIQUEIDENTIFIER NULL,
        Rating INT NULL
    );
    DECLARE @ParsedRatings TABLE
    (
        ProductId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        Rating INT NOT NULL
    );

    BEGIN TRY
        BEGIN TRANSACTION;

        SELECT @UserId = TID_UserId
        FROM dbo.Cart
        WHERE TID_Id = @CartId
          AND TC_Status = 'ACTIVE';

        IF @UserId IS NULL
        BEGIN
            SET @ResultCode = 31;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        INSERT INTO @CartItems
        (
            ProductId,
            ProductName,
            Quantity,
            UnitPrice,
            PreviousStock,
            NewStock,
            IsActive
        )
        SELECT
            CI.TID_ProductId,
            P.TC_Name,
            CI.TN_Quantity,
            CI.TN_UnitPrice,
            P.TN_StockQuantity,
            P.TN_StockQuantity - CI.TN_Quantity,
            P.TB_IsActive
        FROM dbo.CartItem CI
        INNER JOIN dbo.Product P WITH (UPDLOCK, HOLDLOCK) ON P.TID_Id = CI.TID_ProductId
        WHERE CI.TID_CartId = @CartId;

        IF NOT EXISTS (SELECT 1 FROM @CartItems)
        BEGIN
            SET @ResultCode = 2;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        IF EXISTS
        (
            SELECT 1
            FROM @CartItems
            WHERE IsActive = 0 OR NewStock < 0
        )
        BEGIN
            SET @ResultCode = 22;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        IF @HasProductRatings = 1
        BEGIN
            IF ISJSON(@ProductRatings) <> 1
            BEGIN
                SET @ResultCode = 2;
                ROLLBACK TRANSACTION;
                RETURN;
            END;

            INSERT INTO @RawRatings (ProductId, Rating)
            SELECT COALESCE(ProductId, ProductIdCamel), COALESCE(Rating, RatingCamel)
            FROM OPENJSON(@ProductRatings)
            WITH
            (
                ProductId UNIQUEIDENTIFIER '$.ProductId',
                ProductIdCamel UNIQUEIDENTIFIER '$.productId',
                Rating INT '$.Rating',
                RatingCamel INT '$.rating'
            );

            IF EXISTS (
                SELECT 1
                FROM @RawRatings
                WHERE ProductId IS NULL OR Rating IS NULL OR Rating < 1 OR Rating > 5
            )
            BEGIN
                SET @ResultCode = 2;
                ROLLBACK TRANSACTION;
                RETURN;
            END;

            IF EXISTS (
                SELECT 1
                FROM @RawRatings
                GROUP BY ProductId
                HAVING COUNT(*) > 1
            )
            BEGIN
                SET @ResultCode = 2;
                ROLLBACK TRANSACTION;
                RETURN;
            END;

            INSERT INTO @ParsedRatings (ProductId, Rating)
            SELECT ProductId, Rating
            FROM @RawRatings;

            IF EXISTS (
                SELECT 1
                FROM @ParsedRatings PR
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM @CartItems CI
                    WHERE CI.ProductId = PR.ProductId
                )
            )
            BEGIN
                SET @ResultCode = 2;
                ROLLBACK TRANSACTION;
                RETURN;
            END;

            IF EXISTS (
                SELECT 1
                FROM @CartItems CI
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM @ParsedRatings PR
                    WHERE PR.ProductId = CI.ProductId
                )
            )
            BEGIN
                SET @ResultCode = 2;
                ROLLBACK TRANSACTION;
                RETURN;
            END;
        END;

        SELECT @Subtotal = SUM(Quantity * UnitPrice)
        FROM @CartItems;

        SET @OrderId = NEWID();
        SET @OrderNumber = 'ORD-' + CONVERT(NVARCHAR(8), GETDATE(), 112) + '-' + RIGHT(CONVERT(NVARCHAR(36), NEWID()), 6);

        INSERT INTO dbo.[Order]
        (
            TID_Id,
            TID_UserId,
            TC_OrderNumber,
            TC_Status,
            TC_PaymentMethod,
            TC_ShippingAddress,
            TN_Subtotal,
            TN_DiscountTotal,
            TN_Total
        )
        VALUES
        (
            @OrderId,
            @UserId,
            @OrderNumber,
            'PAID',
            @PaymentMethod,
            @ShippingAddress,
            @Subtotal,
            0,
            @Subtotal
        );

        INSERT INTO dbo.OrderItem
        (
            TID_Id,
            TID_OrderId,
            TID_ProductId,
            TC_ProductName,
            TN_Quantity,
            TN_UnitPrice,
            TN_DiscountAmount,
            TN_LineTotal
        )
        SELECT
            NEWID(),
            @OrderId,
            CI.ProductId,
            CI.ProductName,
            CI.Quantity,
            CI.UnitPrice,
            0,
            CI.Quantity * CI.UnitPrice
        FROM @CartItems CI;

        IF @HasProductRatings = 1
        BEGIN
            INSERT INTO dbo.Review
            (
                TID_Id,
                TID_UserId,
                TID_ProductId,
                TID_OrderId,
                TN_Rating,
                TC_Comment
            )
            SELECT
                NEWID(),
                @UserId,
                PR.ProductId,
                @OrderId,
                PR.Rating,
                NULL
            FROM @ParsedRatings PR;
        END;

        UPDATE P
        SET
            P.TN_StockQuantity = CI.NewStock,
            P.TD_UpdatedAt = SYSDATETIME()
        FROM dbo.Product P
        INNER JOIN @CartItems CI ON CI.ProductId = P.TID_Id;

        INSERT INTO dbo.InventoryMovement
        (
            TID_Id,
            TID_ProductId,
            TC_MovementType,
            TN_Quantity,
            TN_PreviousStock,
            TN_NewStock,
            TID_ReferenceOrderId
        )
        SELECT
            NEWID(),
            CI.ProductId,
            'SALE',
            CI.Quantity,
            CI.PreviousStock,
            CI.NewStock,
            @OrderId
        FROM @CartItems CI;

        INSERT INTO dbo.EmailNotification
        (
            TID_Id,
            TID_UserId,
            TID_OrderId,
            TC_Type,
            TC_RecipientEmail,
            TC_Subject,
            TC_Status
        )
        SELECT
            NEWID(),
            AdminUser.TID_Id,
            @OrderId,
            'LOW_STOCK_ALERT',
            AdminUser.TC_Email,
            LEFT(CONCAT('Stock agotado: actualizar ', CI.ProductName, ' para que aparezca disponible'), 255),
            'PENDING'
        FROM @CartItems CI
        INNER JOIN dbo.[User] AdminUser ON AdminUser.TB_IsActive = 1
        INNER JOIN dbo.Role AdminRole
            ON AdminRole.TID_Id = AdminUser.TN_RoleId
            AND AdminRole.TC_Name = 'ADMIN'
            AND AdminRole.TB_IsActive = 1
        WHERE CI.NewStock = 0;

        UPDATE dbo.Cart
        SET
            TC_Status = 'CHECKED_OUT',
            TD_UpdatedAt = SYSDATETIME()
        WHERE TID_Id = @CartId;

        SET @ResultCode = 0;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SET @ResultCode = 2;
    END CATCH;
END;
GO
