CREATE PROCEDURE dbo.usp_ProductImage_Update
    @Id UNIQUEIDENTIFIER,
    @ImageUrl NVARCHAR(500),
    @AltText NVARCHAR(255) = NULL,
    @IsMain BIT,
    @SortOrder INT,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ProductId UNIQUEIDENTIFIER;

    SELECT @ProductId = ProductId
    FROM dbo.ProductImages
    WHERE Id = @Id;

    IF @IsMain = 1
    BEGIN
        UPDATE dbo.ProductImages
        SET IsMain = 0
        WHERE ProductId = @ProductId;
    END;

    UPDATE dbo.ProductImages
    SET
        ImageUrl = @ImageUrl,
        AltText = @AltText,
        IsMain = @IsMain,
        SortOrder = @SortOrder
    WHERE Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO