CREATE PROCEDURE dbo.usp_Wishlist_GetByUserId
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        W.TID_Id AS Id,
        W.TID_UserId AS UserId,
        W.TID_ProductId AS ProductId,
        P.TC_Name AS ProductName,
        P.TN_Price AS Price,
        P.TN_StockQuantity AS StockQuantity,
        P.TB_IsActive AS IsActive,
        W.TD_CreatedAt AS CreatedAt
    FROM dbo.WishlistItem W
    INNER JOIN dbo.Product P ON P.TID_Id = W.TID_ProductId
    WHERE W.TID_UserId = @UserId
    ORDER BY W.TD_CreatedAt DESC;
END;
GO
