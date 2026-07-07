CREATE PROCEDURE dbo.usp_Order_GetDetail
    @OrderId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_Id AS Id,
        TID_UserId AS UserId,
        TC_OrderNumber AS OrderNumber,
        TC_Status AS Status,
        TC_PaymentMethod AS PaymentMethod,
        TC_ShippingAddress AS ShippingAddress,
        TN_Subtotal AS Subtotal,
        TN_DiscountTotal AS DiscountTotal,
        TN_Total AS Total,
        TD_CreatedAt AS CreatedAt,
        TD_UpdatedAt AS UpdatedAt
    FROM dbo.Order
    WHERE TID_Id = @OrderId;

    SELECT
        TID_Id AS Id,
        TID_OrderId AS OrderId,
        TID_ProductId AS ProductId,
        TC_ProductName AS ProductName,
        TN_Quantity AS Quantity,
        TN_UnitPrice AS UnitPrice,
        TN_DiscountAmount AS DiscountAmount,
        TN_LineTotal AS LineTotal
    FROM dbo.OrderItem
    WHERE TID_OrderId = @OrderId
    ORDER BY TC_ProductName;
END;
GO
