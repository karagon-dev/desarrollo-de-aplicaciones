CREATE OR ALTER PROCEDURE dbo.usp_Promotion_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_Id AS Id,
        TC_Name AS Name,
        TC_Description AS Description,
        TN_DiscountPercentage AS DiscountPercentage,
        TD_StartDate AS StartDate,
        TD_EndDate AS EndDate,
        TB_IsActive AS IsActive,
        TD_CreatedAt AS CreatedAt,
        TD_UpdatedAt AS UpdatedAt
    FROM dbo.Promotion
    ORDER BY TD_CreatedAt DESC;
END;
GO
