CREATE PROCEDURE dbo.usp_Wishlist_Remove
    @UserId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.WishlistItem
    WHERE TID_UserId = @UserId
      AND TID_ProductId = @ProductId;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
