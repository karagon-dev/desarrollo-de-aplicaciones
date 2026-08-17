CREATE OR ALTER PROCEDURE dbo.usp_Report_SalesByProduct
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        OI.TID_ProductId AS ProductId,
        OI.TC_ProductName AS ProductName,
        MAX(COALESCE(
            ParsedOrder.BuyerName,
            NULLIF(LTRIM(RTRIM(CP.TC_FirstName + ' ' + CP.TC_LastName)), ''),
            U.TC_Email
        )) AS BuyerName,
        U.TC_Email AS CustomerEmail,
        SUM(OI.TN_Quantity) AS TotalQuantitySold,
        COUNT(DISTINCT O.TID_Id) AS OrderCount,
        SUM(OI.TN_LineTotal) AS TotalSales
    FROM dbo.OrderItem OI
    INNER JOIN dbo.[Order] O ON O.TID_Id = OI.TID_OrderId
    INNER JOIN dbo.[User] U ON U.TID_Id = O.TID_UserId
    LEFT JOIN dbo.CustomerProfile CP ON CP.TID_UserId = U.TID_Id
    OUTER APPLY
    (
        SELECT BuyerSegment =
            CASE
                WHEN CHARINDEX('Cliente:', O.TC_ShippingAddress) > 0 THEN
                    LTRIM(RTRIM(SUBSTRING(
                        O.TC_ShippingAddress,
                        CHARINDEX('Cliente:', O.TC_ShippingAddress) + LEN('Cliente:'),
                        LEN(O.TC_ShippingAddress)
                    )))
                ELSE NULL
            END
    ) OrderDetail
    OUTER APPLY
    (
        SELECT BuyerName =
            NULLIF(LTRIM(RTRIM(
                CASE
                    WHEN OrderDetail.BuyerSegment IS NULL THEN NULL
                    WHEN CHARINDEX('|', OrderDetail.BuyerSegment) > 0 THEN
                        LEFT(OrderDetail.BuyerSegment, CHARINDEX('|', OrderDetail.BuyerSegment) - 1)
                    ELSE OrderDetail.BuyerSegment
                END
            )), '')
    ) ParsedOrder
    WHERE CAST(O.TD_CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate
      AND O.TC_Status IN ('PAID', 'SHIPPED', 'DELIVERED')
    GROUP BY
        OI.TID_ProductId,
        OI.TC_ProductName,
        U.TC_Email
    ORDER BY TotalSales DESC, TotalQuantitySold DESC, OI.TC_ProductName ASC, U.TC_Email ASC;
END;
GO

