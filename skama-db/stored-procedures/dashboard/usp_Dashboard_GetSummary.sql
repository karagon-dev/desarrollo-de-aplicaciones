CREATE PROCEDURE dbo.usp_Dashboard_GetSummary
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ISNULL(SUM(TN_Total), 0) AS TotalSales,
        COUNT(TID_Id) AS TotalOrders,
        ISNULL(AVG(TN_Total), 0) AS AverageOrderValue
    FROM dbo.Order
    WHERE CAST(TD_CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate
      AND TC_Status IN ('PAID', 'SHIPPED', 'DELIVERED');

    SELECT
        COUNT(TID_Id) AS RegisteredCustomers
    FROM dbo.User
    WHERE TB_IsActive = 1;

    SELECT
        COUNT(TID_Id) AS LowStockProducts
    FROM dbo.Product
    WHERE TB_IsActive = 1
      AND TN_StockQuantity <= TN_MinimumStock;

    SELECT TOP 5
        OI.TID_ProductId AS ProductId,
        OI.TC_ProductName AS ProductName,
        SUM(OI.TN_Quantity) AS TotalQuantitySold,
        SUM(OI.TN_LineTotal) AS TotalSales
    FROM dbo.OrderItem OI
    INNER JOIN dbo.Order O ON O.TID_Id = OI.TID_OrderId
    WHERE CAST(O.TD_CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate
      AND O.TC_Status IN ('PAID', 'SHIPPED', 'DELIVERED')
    GROUP BY OI.TID_ProductId, OI.TC_ProductName
    ORDER BY TotalQuantitySold DESC;
END;
GO
