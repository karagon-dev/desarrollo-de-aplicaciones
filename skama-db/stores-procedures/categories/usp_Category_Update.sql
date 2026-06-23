CREATE PROCEDURE dbo.usp_Category_Update
    @Id UNIQUEIDENTIFIER,
    @Name NVARCHAR(100),
    @Description NVARCHAR(255) = NULL,
    @IsActive BIT,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Categories
    SET
        Name = @Name,
        Description = @Description,
        IsActive = @IsActive,
        UpdatedAt = GETDATE()
    WHERE Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO