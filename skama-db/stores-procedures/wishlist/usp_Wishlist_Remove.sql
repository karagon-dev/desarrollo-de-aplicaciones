CREATE PROCEDURE dbo.usp_Wishlist_Remove
    @UserId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.WishlistItems
    WHERE UserId = @UserId
      AND ProductId = @ProductId;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO