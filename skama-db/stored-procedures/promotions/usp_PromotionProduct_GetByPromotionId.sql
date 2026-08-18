CREATE OR ALTER PROCEDURE dbo.usp_PromotionProduct_GetByPromotionId
    @PromotionId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_PromotionId AS PromotionId,
        TID_ProductId AS ProductId
    FROM dbo.PromotionProduct
    WHERE TID_PromotionId = @PromotionId;
END;
GO
