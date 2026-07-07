CREATE PROCEDURE dbo.usp_Report_SalesByPeriod
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CAST(O.TD_CreatedAt AS DATE) AS SaleDate,
        COUNT(O.TID_Id) AS OrderCount,
        SUM(O.TN_Subtotal) AS Subtotal,
        SUM(O.TN_DiscountTotal) AS DiscountTotal,
        SUM(O.TN_Total) AS Total
    FROM dbo.Order O
    WHERE CAST(O.TD_CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate
      AND O.TC_Status IN ('PAID', 'SHIPPED', 'DELIVERED')
    GROUP BY CAST(O.TD_CreatedAt AS DATE)
    ORDER BY SaleDate;
END;
GO
