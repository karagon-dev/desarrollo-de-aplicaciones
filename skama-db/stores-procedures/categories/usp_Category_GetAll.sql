CREATE PROCEDURE dbo.usp_Category_GetAll
    @IncludeInactive BIT = 0
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
    WHERE @IncludeInactive = 1
       OR IsActive = 1
    ORDER BY Name;
END;
GO