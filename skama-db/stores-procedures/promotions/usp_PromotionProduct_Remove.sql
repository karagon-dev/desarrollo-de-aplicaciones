CREATE PROCEDURE dbo.usp_PromotionProduct_Remove
    @PromotionId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.PromotionProducts
    WHERE PromotionId = @PromotionId
      AND ProductId = @ProductId;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO