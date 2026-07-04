CREATE PROCEDURE dbo.usp_Wishlist_Toggle
    @UserId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @IsFavorite BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 FROM dbo.WishlistItem
        WHERE TID_UserId = @UserId AND TID_ProductId = @ProductId
    )
    BEGIN
        DELETE FROM dbo.WishlistItem
        WHERE TID_UserId = @UserId AND TID_ProductId = @ProductId;

        SET @IsFavorite = 0;
        RETURN;
    END;

    INSERT INTO dbo.WishlistItem
    (
        TID_Id,
        TID_UserId,
        TID_ProductId
    )
    VALUES
    (
        NEWID(),
        @UserId,
        @ProductId
    );

    SET @IsFavorite = 1;
END;
GO
