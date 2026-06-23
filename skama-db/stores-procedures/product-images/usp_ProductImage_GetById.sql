CREATE PROCEDURE dbo.usp_ProductImage_GetById
    @Id UNIQUEIDENTIFIER
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
    WHERE Id = @Id;
END;
GO