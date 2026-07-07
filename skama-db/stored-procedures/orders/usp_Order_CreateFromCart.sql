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

        IF NOT EXISTS (SELECT 1 FROM dbo.CartItem WHERE TID_CartId = @CartId)
        BEGIN
            SET @ResultCode = 2;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        IF EXISTS
        (
            SELECT 1
            FROM dbo.CartItem CI
            INNER JOIN dbo.Product P ON P.TID_Id = CI.TID_ProductId
            WHERE CI.TID_CartId = @CartId
              AND (P.TB_IsActive = 0 OR CI.TN_Quantity > P.TN_StockQuantity)
        )
        BEGIN
            SET @ResultCode = 22;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        SELECT @Subtotal = SUM(TN_Quantity * TN_UnitPrice)
        FROM dbo.CartItem
        WHERE TID_CartId = @CartId;

        SET @OrderId = NEWID();
        SET @OrderNumber = 'ORD-' + CONVERT(NVARCHAR(8), GETDATE(), 112) + '-' + RIGHT(CONVERT(NVARCHAR(36), NEWID()), 6);

        INSERT INTO dbo.Order
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
            'PENDING',
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
            CI.TID_ProductId AS ProductId,
            P.TC_Name AS Name,
            CI.TN_Quantity AS Quantity,
            CI.TN_UnitPrice AS UnitPrice,
            0,
            CI.TN_Quantity * CI.TN_UnitPrice
        FROM dbo.CartItem CI
        INNER JOIN dbo.Product P ON P.TID_Id = CI.TID_ProductId
        WHERE CI.TID_CartId = @CartId;

        UPDATE P
        SET
            P.TN_StockQuantity = P.TN_StockQuantity - CI.TN_Quantity,
            P.TD_UpdatedAt = SYSDATETIME()
        FROM dbo.Product P
        INNER JOIN dbo.CartItem CI ON CI.TID_ProductId = P.TID_Id
        WHERE CI.TID_CartId = @CartId;

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
