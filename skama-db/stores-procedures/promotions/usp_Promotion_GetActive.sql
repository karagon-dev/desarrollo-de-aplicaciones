CREATE PROCEDURE dbo.usp_Promotion_GetActive
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
    WHERE TB_IsActive = 1
      AND CAST(GETDATE() AS DATE) BETWEEN TD_StartDate AND TD_EndDate
    ORDER BY TD_EndDate ASC;
END;
GO
