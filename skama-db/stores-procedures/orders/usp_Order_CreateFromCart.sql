CREATE PROCEDURE dbo.usp_Order_CreateFromCart
    @CartId UNIQUEIDENTIFIER,
    @PaymentMethod NVARCHAR(50),
    @ShippingAddress NVARCHAR(500),
    @OrderId UNIQUEIDENTIFIER OUTPUT,
    @OrderNumber NVARCHAR(50) OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UserId UNIQUEIDENTIFIER;
    DECLARE @Subtotal DECIMAL(10,2);

    BEGIN TRY
        BEGIN TRANSACTION;

        SELECT @UserId = UserId
        FROM dbo.Carts
        WHERE Id = @CartId
          AND Status = 'ACTIVE';

        IF @UserId IS NULL
        BEGIN
            SET @ResultCode = 31;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        IF NOT EXISTS (SELECT 1 FROM dbo.CartItems WHERE CartId = @CartId)
        BEGIN
            SET @ResultCode = 2;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        IF EXISTS
        (
            SELECT 1
            FROM dbo.CartItems CI
            INNER JOIN dbo.Products P ON P.Id = CI.ProductId
            WHERE CI.CartId = @CartId
              AND (P.IsActive = 0 OR CI.Quantity > P.StockQuantity)
        )
        BEGIN
            SET @ResultCode = 22;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        SELECT @Subtotal = SUM(Quantity * UnitPrice)
        FROM dbo.CartItems
        WHERE CartId = @CartId;

        SET @OrderId = NEWID();
        SET @OrderNumber = 'ORD-' + CONVERT(NVARCHAR(8), GETDATE(), 112) + '-' + RIGHT(CONVERT(NVARCHAR(36), NEWID()), 6);

        INSERT INTO dbo.Orders
        (
            Id,
            UserId,
            OrderNumber,
            Status,
            PaymentMethod,
            ShippingAddress,
            Subtotal,
            DiscountTotal,
            Total
        )
        VALUES
        (
            @OrderId,
            @UserId,
            @OrderNumber,
            'PENDING',
            @PaymentMethod,
            @ShippingAddress,
            @Subtotal,
            0,
            @Subtotal
        );

        INSERT INTO dbo.OrderItems
        (
            Id,
            OrderId,
            ProductId,
            ProductName,
            Quantity,
            UnitPrice,
            DiscountAmount,
            LineTotal
        )
        SELECT
            NEWID(),
            @OrderId,
            CI.ProductId,
            P.Name,
            CI.Quantity,
            CI.UnitPrice,
            0,
            CI.Quantity * CI.UnitPrice
        FROM dbo.CartItems CI
        INNER JOIN dbo.Products P ON P.Id = CI.ProductId
        WHERE CI.CartId = @CartId;

        UPDATE P
        SET
            P.StockQuantity = P.StockQuantity - CI.Quantity,
            P.UpdatedAt = SYSDATETIME()
        FROM dbo.Products P
        INNER JOIN dbo.CartItems CI ON CI.ProductId = P.Id
        WHERE CI.CartId = @CartId;

        UPDATE dbo.Carts
        SET
            Status = 'CHECKED_OUT',
            UpdatedAt = SYSDATETIME()
        WHERE Id = @CartId;

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