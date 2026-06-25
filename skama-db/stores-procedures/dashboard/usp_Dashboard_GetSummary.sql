CREATE PROCEDURE dbo.usp_Dashboard_GetSummary
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ISNULL(SUM(Total), 0) AS TotalSales,
        COUNT(Id) AS TotalOrders,
        ISNULL(AVG(Total), 0) AS AverageOrderValue
    FROM dbo.Orders
    WHERE CAST(CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate
      AND Status IN ('PAID', 'SHIPPED', 'DELIVERED');

    SELECT
        COUNT(Id) AS RegisteredCustomers
    FROM dbo.Users
    WHERE IsActive = 1;

    SELECT
        COUNT(Id) AS LowStockProducts
    FROM dbo.Products
    WHERE IsActive = 1
      AND StockQuantity <= MinimumStock;

    SELECT TOP 5
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