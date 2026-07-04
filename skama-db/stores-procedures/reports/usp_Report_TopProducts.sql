CREATE PROCEDURE dbo.usp_Report_TopProducts
    @StartDate DATE,
    @EndDate DATE,
    @Top INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP (@Top)
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
