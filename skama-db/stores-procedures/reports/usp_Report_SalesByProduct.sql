CREATE PROCEDURE dbo.usp_Report_SalesByProduct
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        OI.ProductId,
        OI.ProductName,
        SUM(OI.Quantity) AS TotalQuantitySold,
        SUM(OI.LineTotal) AS TotalSales
    FROM dbo.OrderItems OI
    INNER JOIN dbo.Orders O ON O.Id = OI.OrderId
    WHERE CAST(O.CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate
      AND O.Status IN ('PAID', 'SHIPPED', 'DELIVERED')
    GROUP BY OI.ProductId, OI.ProductName
    ORDER BY TotalSales DESC;
END;
GO