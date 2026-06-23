CREATE PROCEDURE dbo.usp_Order_Cancel
    @OrderId UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CurrentStatus NVARCHAR(30);

    SELECT @CurrentStatus = Status
    FROM dbo.Orders
    WHERE Id = @OrderId;

    IF @CurrentStatus IS NULL
    BEGIN
        SET @ResultCode = 40;
        RETURN;
    END;

    IF @CurrentStatus IN ('SHIPPED', 'DELIVERED', 'CANCELLED')
    BEGIN
        SET @ResultCode = 41;
        RETURN;
    END;

    UPDATE P
    SET
        P.StockQuantity = P.StockQuantity + OI.Quantity,
        P.UpdatedAt = SYSDATETIME()
    FROM dbo.Products P
    INNER JOIN dbo.OrderItems OI ON OI.ProductId = P.Id
    WHERE OI.OrderId = @OrderId;

    UPDATE dbo.Orders
    SET
        Status = 'CANCELLED',
        UpdatedAt = SYSDATETIME()
    WHERE Id = @OrderId;

    SET @RowsAffected = @@ROWCOUNT;
    SET @ResultCode = 0;
END;
GO