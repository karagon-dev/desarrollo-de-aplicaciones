CREATE PROCEDURE dbo.usp_Category_GetById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Name,
        Description,
        IsActive,
        CreatedAt,
        UpdatedAt
    FROM dbo.Categories
    WHERE Id = @Id;
END;
GO