CREATE PROCEDURE dbo.usp_Category_Insert
    @Name NVARCHAR(100),
    @Description NVARCHAR(255) = NULL,
    @NewId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @NewId = NEWID();

    INSERT INTO dbo.Categories
    (
        Id,
        Name,
        Description,
        IsActive,
        CreatedAt,
        UpdatedAt
    )
    VALUES
    (
        @NewId,
        @Name,
        @Description,
        1,
        GETDATE(),
        GETDATE()
    );
END;
GO