CREATE PROCEDURE dbo.usp_ProductImage_SetMain
    @Id UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ProductId UNIQUEIDENTIFIER;

    SELECT @ProductId = ProductId
    FROM dbo.ProductImages
    WHERE Id = @Id;

    UPDATE dbo.ProductImages
    SET IsMain = 0
    WHERE ProductId = @ProductId;

    UPDATE dbo.ProductImages
    SET IsMain = 1
    WHERE Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO