CREATE PROCEDURE dbo.usp_Wishlist_Toggle
    @UserId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @IsFavorite BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 FROM dbo.WishlistItems
        WHERE UserId = @UserId AND ProductId = @ProductId
    )
    BEGIN
        DELETE FROM dbo.WishlistItems
        WHERE UserId = @UserId AND ProductId = @ProductId;

        SET @IsFavorite = 0;
        RETURN;
    END;

    INSERT INTO dbo.WishlistItems
    (
        Id,
        UserId,
        ProductId
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