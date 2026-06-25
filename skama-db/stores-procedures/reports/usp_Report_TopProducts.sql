CREATE PROCEDURE dbo.usp_Report_TopProducts
    @StartDate DATE,
    @EndDate DATE,
    @Top INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP (@Top)
        OI.ProductId,
        OI.ProductName,
        SUM(OI.Quantity) AS TotalQuantitySold,
        SUM(OI.LineTotal) AS TotalSales
    FROM dbo.OrderItems OI
    INNER JOIN dbo.Orders O ON O.Id = OI.OrderId
    WHERE CAST(O.CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate
      AND O.Status IN ('PAID', 'SHIPPED', 'DELIVERED')
    GROUP BY OI.ProductId, OI.ProductName
    ORDER BY TotalQuantitySold DESC;
END;
GO