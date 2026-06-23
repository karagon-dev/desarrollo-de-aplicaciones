CREATE PROCEDURE dbo.usp_ProductImage_Insert
    @ProductId UNIQUEIDENTIFIER,
    @ImageUrl NVARCHAR(500),
    @AltText NVARCHAR(255) = NULL,
    @IsMain BIT = 0,
    @SortOrder INT = 0,
    @NewId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @NewId = NEWID();

    IF @IsMain = 1
    BEGIN
        UPDATE dbo.ProductImages
        SET IsMain = 0
        WHERE ProductId = @ProductId;
    END;

    INSERT INTO dbo.ProductImages
    (
        Id,
        ProductId,
        ImageUrl,
        AltText,
        IsMain,
        SortOrder
    )
    VALUES
    (
        @NewId,
        @ProductId,
        @ImageUrl,
        @AltText,
        @IsMain,
        @SortOrder
    );
END;
GO