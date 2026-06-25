CREATE PROCEDURE dbo.usp_Wishlist_GetByUserId
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        W.Id,
        W.UserId,
        W.ProductId,
        P.Name AS ProductName,
        P.Price,
        P.StockQuantity,
        P.IsActive,
        W.CreatedAt
    FROM dbo.WishlistItems W
    INNER JOIN dbo.Products P ON P.Id = W.ProductId
    WHERE W.UserId = @UserId
    ORDER BY W.CreatedAt DESC;
END;
GO