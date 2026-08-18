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
