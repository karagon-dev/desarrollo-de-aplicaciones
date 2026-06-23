CREATE PROCEDURE dbo.usp_ProductImage_GetByProductId
    @ProductId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        ProductId,
        ImageUrl,
        AltText,
        IsMain,
        SortOrder
    FROM dbo.ProductImages
    WHERE ProductId = @ProductId
    ORDER BY IsMain DESC, SortOrder ASC;
END;
GO