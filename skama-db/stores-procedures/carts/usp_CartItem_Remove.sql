CREATE PROCEDURE dbo.usp_CartItem_Remove
    @CartItemId UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CartId UNIQUEIDENTIFIER;

    SELECT @CartId = CI.CartId
    FROM dbo.CartItems CI
    INNER JOIN dbo.Carts C ON C.Id = CI.CartId
    WHERE CI.Id = @CartItemId
      AND C.Status = 'ACTIVE';

    IF @CartId IS NULL
    BEGIN
        SET @ResultCode = 30;
        RETURN;
    END;

    DELETE FROM dbo.CartItems
    WHERE Id = @CartItemId;

    SET @RowsAffected = @@ROWCOUNT;

    UPDATE dbo.Carts
    SET UpdatedAt = SYSDATETIME()
    WHERE Id = @CartId;

    SET @ResultCode = 0;
END;
GO