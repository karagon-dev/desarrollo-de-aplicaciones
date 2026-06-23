CREATE PROCEDURE dbo.usp_Order_GetByUserId
    @UserId UNIQUEIDENTIFIER
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
    WHERE UserId = @UserId
    ORDER BY CreatedAt DESC;
END;
GO