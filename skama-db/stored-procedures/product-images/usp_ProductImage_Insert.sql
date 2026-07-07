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
        UPDATE dbo.ProductImage
        SET TB_IsMain = 0
        WHERE TID_ProductId = @ProductId;
    END;

    INSERT INTO dbo.ProductImage
    (
        TID_Id,
        TID_ProductId,
        TC_ImageUrl,
        TC_AltText,
        TB_IsMain,
        TN_SortOrder
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
