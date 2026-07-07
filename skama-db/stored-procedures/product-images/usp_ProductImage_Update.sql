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

    SELECT @ProductId = TID_ProductId
    FROM dbo.ProductImage
    WHERE TID_Id = @Id;

    IF @IsMain = 1
    BEGIN
        UPDATE dbo.ProductImage
        SET TB_IsMain = 0
        WHERE TID_ProductId = @ProductId;
    END;

    UPDATE dbo.ProductImage
    SET
        TC_ImageUrl = @ImageUrl,
        TC_AltText = @AltText,
        TB_IsMain = @IsMain,
        TN_SortOrder = @SortOrder
    WHERE TID_Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
