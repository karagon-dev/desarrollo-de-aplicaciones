CREATE PROCEDURE dbo.usp_Order_Cancel
    @OrderId UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CurrentStatus NVARCHAR(30);

    SELECT @CurrentStatus = TC_Status
    FROM dbo.Order
    WHERE TID_Id = @OrderId;

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
        P.TN_StockQuantity = P.TN_StockQuantity + OI.TN_Quantity,
        P.TD_UpdatedAt = SYSDATETIME()
    FROM dbo.Product P
    INNER JOIN dbo.OrderItem OI ON OI.TID_ProductId = P.TID_Id
    WHERE OI.TID_OrderId = @OrderId;

    UPDATE dbo.Order
    SET
        TC_Status = 'CANCELLED',
        TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @OrderId;

    SET @RowsAffected = @@ROWCOUNT;
    SET @ResultCode = 0;
END;
GO
