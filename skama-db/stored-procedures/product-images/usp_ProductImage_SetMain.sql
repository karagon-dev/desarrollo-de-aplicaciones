CREATE PROCEDURE dbo.usp_ProductImage_SetMain
    @Id UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ProductId UNIQUEIDENTIFIER;

    SELECT @ProductId = TID_ProductId
    FROM dbo.ProductImage
    WHERE TID_Id = @Id;

    UPDATE dbo.ProductImage
    SET TB_IsMain = 0
    WHERE TID_ProductId = @ProductId;

    UPDATE dbo.ProductImage
    SET TB_IsMain = 1
    WHERE TID_Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
