CREATE OR ALTER PROCEDURE dbo.usp_PromotionProduct_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_PromotionId AS PromotionId,
        TID_ProductId AS ProductId
    FROM dbo.PromotionProduct;
END;
GO
