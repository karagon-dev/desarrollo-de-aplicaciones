CREATE PROCEDURE dbo.usp_ProductImage_GetByProductId
    @ProductId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_Id AS Id,
        TID_ProductId AS ProductId,
        TC_ImageUrl AS ImageUrl,
        TC_AltText AS AltText,
        TB_IsMain AS IsMain,
        TN_SortOrder AS SortOrder
    FROM dbo.ProductImage
    WHERE TID_ProductId = @ProductId
    ORDER BY TB_IsMain DESC, TN_SortOrder ASC;
END;
GO
