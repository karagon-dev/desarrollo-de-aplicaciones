CREATE PROCEDURE dbo.usp_ProductImage_Delete
    @Id UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.ProductImages
    WHERE Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO