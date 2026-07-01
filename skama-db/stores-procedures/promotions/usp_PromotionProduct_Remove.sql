CREATE PROCEDURE dbo.usp_PromotionProduct_Remove
    @PromotionId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.PromotionProduct
    WHERE TID_PromotionId = @PromotionId
      AND TID_ProductId = @ProductId;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
