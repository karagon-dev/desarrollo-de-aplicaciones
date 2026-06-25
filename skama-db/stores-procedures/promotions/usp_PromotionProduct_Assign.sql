CREATE PROCEDURE dbo.usp_PromotionProduct_Assign
    @PromotionId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @NewId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 FROM dbo.PromotionProducts
        WHERE PromotionId = @PromotionId AND ProductId = @ProductId
    )
    BEGIN
        SET @ResultCode = 3;
        RETURN;
    END;

    SET @NewId = NEWID();

    INSERT INTO dbo.PromotionProducts
    (
        Id,
        PromotionId,
        ProductId
    )
    VALUES
    (
        @NewId,
        @PromotionId,
        @ProductId
    );

    SET @ResultCode = 0;
END;
GO