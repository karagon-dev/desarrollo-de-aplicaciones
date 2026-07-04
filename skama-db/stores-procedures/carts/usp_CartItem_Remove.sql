CREATE PROCEDURE dbo.usp_CartItem_Remove
    @CartItemId UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CartId UNIQUEIDENTIFIER;

    SELECT @CartId = CI.TID_CartId
    FROM dbo.CartItem CI
    INNER JOIN dbo.Cart C ON C.TID_Id = CI.TID_CartId
    WHERE CI.TID_Id = @CartItemId
      AND C.TC_Status = 'ACTIVE';

    IF @CartId IS NULL
    BEGIN
        SET @ResultCode = 30;
        RETURN;
    END;

    DELETE FROM dbo.CartItem
    WHERE TID_Id = @CartItemId;

    SET @RowsAffected = @@ROWCOUNT;

    UPDATE dbo.Cart
    SET TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @CartId;

    SET @ResultCode = 0;
END;
GO
