CREATE PROCEDURE dbo.usp_Order_GetDetail
    @OrderId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        UserId,
        OrderNumber,
        Status,
        PaymentMethod,
        ShippingAddress,
        Subtotal,
        DiscountTotal,
        Total,
        CreatedAt,
        UpdatedAt
    FROM dbo.Orders
    WHERE Id = @OrderId;

    SELECT
        Id,
        OrderId,
        ProductId,
        ProductName,
        Quantity,
        UnitPrice,
        DiscountAmount,
        LineTotal
    FROM dbo.OrderItems
    WHERE OrderId = @OrderId
    ORDER BY ProductName;
END;
GO