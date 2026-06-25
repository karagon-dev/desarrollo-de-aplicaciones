CREATE PROCEDURE dbo.usp_Promotion_GetActive
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Name,
        Description,
        DiscountPercentage,
        StartDate,
        EndDate,
        IsActive,
        CreatedAt,
        UpdatedAt
    FROM dbo.Promotions
    WHERE IsActive = 1
      AND CAST(GETDATE() AS DATE) BETWEEN StartDate AND EndDate
    ORDER BY EndDate ASC;
END;
GO