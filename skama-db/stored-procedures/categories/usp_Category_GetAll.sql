CREATE PROCEDURE dbo.usp_Category_GetAll
    @IncludeInactive BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_Id AS Id,
        TC_Name AS Name,
        TC_Description AS Description,
        TB_IsActive AS IsActive,
        TD_CreatedAt AS CreatedAt,
        TD_UpdatedAt AS UpdatedAt
    FROM dbo.Category
    WHERE @IncludeInactive = 1
       OR TB_IsActive = 1
    ORDER BY TC_Name;
END;
GO
