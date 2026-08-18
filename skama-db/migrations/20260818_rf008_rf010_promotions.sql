/*
  SKAMA - RF-008 / RF-010
  Historial de pedidos (consulta existente) y promociones/descuentos en catalogo, carrito y checkout.

  Ejecutar en bases existentes para actualizar stored procedures.
*/
GO

CREATE OR ALTER PROCEDURE dbo.usp_Promotion_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_Id AS Id,
        TC_Name AS Name,
        TC_Description AS Description,
        TN_DiscountPercentage AS DiscountPercentage,
        TD_StartDate AS StartDate,
        TD_EndDate AS EndDate,
        TB_IsActive AS IsActive,
        TD_CreatedAt AS CreatedAt,
        TD_UpdatedAt AS UpdatedAt
    FROM dbo.Promotion
    ORDER BY TD_CreatedAt DESC;
END;
GO



CREATE OR ALTER PROCEDURE dbo.usp_Promotion_GetById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_Id AS Id,
        TC_Name AS Name,
        TC_Description AS Description,
        TN_DiscountPercentage AS DiscountPercentage,
        TD_StartDate AS StartDate,
        TD_EndDate AS EndDate,
        TB_IsActive AS IsActive,
        TD_CreatedAt AS CreatedAt,
        TD_UpdatedAt AS UpdatedAt
    FROM dbo.Promotion
    WHERE TID_Id = @Id;
END;
GO



CREATE OR ALTER PROCEDURE dbo.usp_PromotionProduct_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_PromotionId AS PromotionId,
        TID_ProductId AS ProductId
    FROM dbo.PromotionProduct;
END;
GO



CREATE OR ALTER PROCEDURE dbo.usp_PromotionProduct_GetByPromotionId
    @PromotionId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_PromotionId AS PromotionId,
        TID_ProductId AS ProductId
    FROM dbo.PromotionProduct
    WHERE TID_PromotionId = @PromotionId;
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
        ISNULL(Promo.DiscountPercentage, 0) AS DiscountPercentage,
        Promo.PromotionName,
        P.TN_StockQuantity AS StockQuantity,
        P.TN_MinimumStock AS MinimumStock,
        P.TB_IsLimitedEdition AS IsLimitedEdition,
        P.TB_IsActive AS IsActive,
        P.TD_CreatedAt AS CreatedAt,
        P.TD_UpdatedAt AS UpdatedAt
    FROM dbo.Product P
    INNER JOIN dbo.Category C ON C.TID_Id = P.TID_CategoryId
    OUTER APPLY
    (
        SELECT TOP 1
            PR.TN_DiscountPercentage AS DiscountPercentage,
            PR.TC_Name AS PromotionName
        FROM dbo.PromotionProduct PP
        INNER JOIN dbo.Promotion PR ON PR.TID_Id = PP.TID_PromotionId
        WHERE PP.TID_ProductId = P.TID_Id
          AND PR.TB_IsActive = 1
          AND CAST(SYSDATETIME() AS DATE) BETWEEN PR.TD_StartDate AND PR.TD_EndDate
        ORDER BY PR.TN_DiscountPercentage DESC
    ) Promo
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




CREATE OR ALTER PROCEDURE dbo.usp_Product_GetById
    @Id UNIQUEIDENTIFIER
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
        ISNULL(Promo.DiscountPercentage, 0) AS DiscountPercentage,
        Promo.PromotionName,
        P.TN_StockQuantity AS StockQuantity,
        P.TN_MinimumStock AS MinimumStock,
        P.TB_IsLimitedEdition AS IsLimitedEdition,
        P.TB_IsActive AS IsActive,
        P.TD_CreatedAt AS CreatedAt,
        P.TD_UpdatedAt AS UpdatedAt
    FROM dbo.Product P
    INNER JOIN dbo.Category C ON C.TID_Id = P.TID_CategoryId
    OUTER APPLY
    (
        SELECT TOP 1
            PR.TN_DiscountPercentage AS DiscountPercentage,
            PR.TC_Name AS PromotionName
        FROM dbo.PromotionProduct PP
        INNER JOIN dbo.Promotion PR ON PR.TID_Id = PP.TID_PromotionId
        WHERE PP.TID_ProductId = P.TID_Id
          AND PR.TB_IsActive = 1
          AND CAST(SYSDATETIME() AS DATE) BETWEEN PR.TD_StartDate AND PR.TD_EndDate
        ORDER BY PR.TN_DiscountPercentage DESC
    ) Promo
    WHERE P.TID_Id = @Id;
END;
GO




CREATE OR ALTER PROCEDURE dbo.usp_CartItem_Add
    @CartId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @Quantity INT,
    @CartItemId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UnitPrice DECIMAL(10,2);
    DECLARE @ListPrice DECIMAL(10,2);
    DECLARE @DiscountPercentage DECIMAL(5,2) = 0;
    DECLARE @StockQuantity INT;
    DECLARE @ExistingQuantity INT = 0;
    DECLARE @RequestedTotalQuantity INT;

    IF @Quantity <= 0
    BEGIN
        SET @ResultCode = 2; -- VALIDATION_ERROR
        RETURN;
    END;

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.Cart
        WHERE TID_Id = @CartId
          AND TC_Status = 'ACTIVE'
    )
    BEGIN
        SET @ResultCode = 31; -- CART_NOT_ACTIVE
        RETURN;
    END;

    SELECT
        @ListPrice = TN_Price,
        @StockQuantity = TN_StockQuantity
    FROM dbo.Product
    WHERE TID_Id = @ProductId
      AND TB_IsActive = 1;

    IF @ListPrice IS NULL
    BEGIN
        SET @ResultCode = 20; -- PRODUCT_NOT_FOUND
        RETURN;
    END;

    SELECT TOP 1
        @DiscountPercentage = PR.TN_DiscountPercentage
    FROM dbo.PromotionProduct PP
    INNER JOIN dbo.Promotion PR ON PR.TID_Id = PP.TID_PromotionId
    WHERE PP.TID_ProductId = @ProductId
      AND PR.TB_IsActive = 1
      AND CAST(SYSDATETIME() AS DATE) BETWEEN PR.TD_StartDate AND PR.TD_EndDate
    ORDER BY PR.TN_DiscountPercentage DESC;

    SET @UnitPrice = ROUND(@ListPrice * (1 - ISNULL(@DiscountPercentage, 0) / 100.0), 2);

    SELECT
        @ExistingQuantity = TN_Quantity
    FROM dbo.CartItem
    WHERE TID_CartId = @CartId
      AND TID_ProductId = @ProductId;

    SET @RequestedTotalQuantity = @ExistingQuantity + @Quantity;

    IF @RequestedTotalQuantity > @StockQuantity
    BEGIN
        SET @ResultCode = 22; -- INSUFFICIENT_STOCK
        RETURN;
    END;

    IF @ExistingQuantity > 0
    BEGIN
        UPDATE dbo.CartItem
        SET
            TN_Quantity = @RequestedTotalQuantity,
            TN_UnitPrice = @UnitPrice
        WHERE TID_CartId = @CartId
          AND TID_ProductId = @ProductId;

        SELECT
            @CartItemId = TID_Id
        FROM dbo.CartItem
        WHERE TID_CartId = @CartId
          AND TID_ProductId = @ProductId;
    END
    ELSE
    BEGIN
        SET @CartItemId = NEWID();

        INSERT INTO dbo.CartItem
        (
            TID_Id,
            TID_CartId,
            TID_ProductId,
            TN_Quantity,
            TN_UnitPrice
        )
        VALUES
        (
            @CartItemId,
            @CartId,
            @ProductId,
            @Quantity,
            @UnitPrice
        );
    END;

    UPDATE dbo.Cart
    SET TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @CartId;

    SET @ResultCode = 0; -- SUCCESS
END;
GO




CREATE OR ALTER PROCEDURE dbo.usp_Cart_GetDetail
    @CartId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        C.TID_Id AS Id,
        C.TID_UserId AS UserId,
        C.TC_Status AS Status,
        C.TD_CreatedAt AS CreatedAt,
        C.TD_UpdatedAt AS UpdatedAt
    FROM dbo.Cart C
    WHERE C.TID_Id = @CartId;

    SELECT
        CI.TID_Id AS Id,
        CI.TID_CartId AS CartId,
        CI.TID_ProductId AS ProductId,
        P.TC_Name AS ProductName,
        CI.TN_Quantity AS Quantity,
        ROUND(P.TN_Price * (1 - ISNULL(Promo.DiscountPercentage, 0) / 100.0), 2) AS UnitPrice,
        P.TN_Price AS OriginalUnitPrice,
        ISNULL(Promo.DiscountPercentage, 0) AS DiscountPercentage,
        CI.TN_Quantity * ROUND(P.TN_Price * (1 - ISNULL(Promo.DiscountPercentage, 0) / 100.0), 2) AS Subtotal,
        P.TN_StockQuantity AS StockQuantity,
        P.TB_IsActive AS IsActive
    FROM dbo.CartItem CI
    INNER JOIN dbo.Product P ON P.TID_Id = CI.TID_ProductId
    OUTER APPLY
    (
        SELECT TOP 1 PR.TN_DiscountPercentage AS DiscountPercentage
        FROM dbo.PromotionProduct PP
        INNER JOIN dbo.Promotion PR ON PR.TID_Id = PP.TID_PromotionId
        WHERE PP.TID_ProductId = P.TID_Id
          AND PR.TB_IsActive = 1
          AND CAST(SYSDATETIME() AS DATE) BETWEEN PR.TD_StartDate AND PR.TD_EndDate
        ORDER BY PR.TN_DiscountPercentage DESC
    ) Promo
    WHERE CI.TID_CartId = @CartId
    ORDER BY P.TC_Name;

    SELECT
        SUM(CI.TN_Quantity * ROUND(P.TN_Price * (1 - ISNULL(Promo.DiscountPercentage, 0) / 100.0), 2)) AS Total
    FROM dbo.CartItem CI
    INNER JOIN dbo.Product P ON P.TID_Id = CI.TID_ProductId
    OUTER APPLY
    (
        SELECT TOP 1 PR.TN_DiscountPercentage AS DiscountPercentage
        FROM dbo.PromotionProduct PP
        INNER JOIN dbo.Promotion PR ON PR.TID_Id = PP.TID_PromotionId
        WHERE PP.TID_ProductId = P.TID_Id
          AND PR.TB_IsActive = 1
          AND CAST(SYSDATETIME() AS DATE) BETWEEN PR.TD_StartDate AND PR.TD_EndDate
        ORDER BY PR.TN_DiscountPercentage DESC
    ) Promo
    WHERE CI.TID_CartId = @CartId;
END;
GO




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
    DECLARE @DiscountTotal DECIMAL(10,2);
    DECLARE @HasProductRatings BIT =
        CASE WHEN NULLIF(LTRIM(RTRIM(ISNULL(@ProductRatings, N''))), N'') IS NULL THEN 0 ELSE 1 END;
    DECLARE @CartItems TABLE
    (
        ProductId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        ProductName NVARCHAR(150) NOT NULL,
        Quantity INT NOT NULL,
        UnitPrice DECIMAL(10,2) NOT NULL,
        DiscountAmount DECIMAL(10,2) NOT NULL,
        LineTotal DECIMAL(10,2) NOT NULL,
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
            DiscountAmount,
            LineTotal,
            PreviousStock,
            NewStock,
            IsActive
        )
        SELECT
            CI.TID_ProductId,
            P.TC_Name,
            CI.TN_Quantity,
            P.TN_Price,
            ROUND(P.TN_Price * CI.TN_Quantity * ISNULL(Promo.DiscountPercentage, 0) / 100.0, 2),
            ROUND(P.TN_Price * CI.TN_Quantity, 2)
                - ROUND(P.TN_Price * CI.TN_Quantity * ISNULL(Promo.DiscountPercentage, 0) / 100.0, 2),
            P.TN_StockQuantity,
            P.TN_StockQuantity - CI.TN_Quantity,
            P.TB_IsActive
        FROM dbo.CartItem CI
        INNER JOIN dbo.Product P WITH (UPDLOCK, HOLDLOCK) ON P.TID_Id = CI.TID_ProductId
        OUTER APPLY
        (
            SELECT TOP 1 PR.TN_DiscountPercentage AS DiscountPercentage
            FROM dbo.PromotionProduct PP
            INNER JOIN dbo.Promotion PR ON PR.TID_Id = PP.TID_PromotionId
            WHERE PP.TID_ProductId = P.TID_Id
              AND PR.TB_IsActive = 1
              AND CAST(SYSDATETIME() AS DATE) BETWEEN PR.TD_StartDate AND PR.TD_EndDate
            ORDER BY PR.TN_DiscountPercentage DESC
        ) Promo
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

        SELECT
            @Subtotal = SUM(Quantity * UnitPrice),
            @DiscountTotal = SUM(DiscountAmount)
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
            ISNULL(@DiscountTotal, 0),
            @Subtotal - ISNULL(@DiscountTotal, 0)
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
            CI.DiscountAmount,
            CI.LineTotal
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



