CREATE PROCEDURE dbo.usp_Order_UpdateStatus
    @OrderId UNIQUEIDENTIFIER,
    @Status NVARCHAR(30),
    @RowsAffected INT OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF @Status NOT IN ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED')
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    UPDATE dbo.Order
    SET
        TC_Status = @Status,
        TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @OrderId;

    SET @RowsAffected = @@ROWCOUNT;

    IF @RowsAffected = 0
    BEGIN
        SET @ResultCode = 40;
        RETURN;
    END;

    SET @ResultCode = 0;
END;
GO
