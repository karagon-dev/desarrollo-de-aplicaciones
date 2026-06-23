CREATE PROCEDURE dbo.usp_Order_GetById
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
END;
GO