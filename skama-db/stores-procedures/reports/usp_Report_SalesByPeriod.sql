CREATE PROCEDURE dbo.usp_Report_SalesByPeriod
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CAST(O.CreatedAt AS DATE) AS SaleDate,
        COUNT(O.Id) AS OrderCount,
        SUM(O.Subtotal) AS Subtotal,
        SUM(O.DiscountTotal) AS DiscountTotal,
        SUM(O.Total) AS Total
    FROM dbo.Orders O
    WHERE CAST(O.CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate
      AND O.Status IN ('PAID', 'SHIPPED', 'DELIVERED')
    GROUP BY CAST(O.CreatedAt AS DATE)
    ORDER BY SaleDate;
END;
GO