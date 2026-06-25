CREATE PROCEDURE dbo.usp_Wishlist_Add
    @UserId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @NewId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 FROM dbo.WishlistItems
        WHERE UserId = @UserId AND ProductId = @ProductId
    )
    BEGIN
        SET @ResultCode = 3;
        RETURN;
    END;

    SET @NewId = NEWID();

    INSERT INTO dbo.WishlistItems
    (
        Id,
        UserId,
        ProductId
    )
    VALUES
    (
        @NewId,
        @UserId,
        @ProductId
    );

    SET @ResultCode = 0;
END;
GO