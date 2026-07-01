CREATE PROCEDURE dbo.usp_ProductImage_GetById
    @Id UNIQUEIDENTIFIER
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
    WHERE TID_Id = @Id;
END;
GO
