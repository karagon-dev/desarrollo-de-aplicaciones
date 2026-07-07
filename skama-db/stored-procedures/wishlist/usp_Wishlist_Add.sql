CREATE PROCEDURE dbo.usp_Wishlist_Add
    @UserId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @NewId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 FROM dbo.WishlistItem
        WHERE TID_UserId = @UserId AND TID_ProductId = @ProductId
    )
    BEGIN
        SET @ResultCode = 3;
        RETURN;
    END;

    SET @NewId = NEWID();

    INSERT INTO dbo.WishlistItem
    (
        TID_Id,
        TID_UserId,
        TID_ProductId
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
