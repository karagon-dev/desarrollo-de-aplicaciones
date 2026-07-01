CREATE PROCEDURE dbo.usp_Order_GetByUserId
    @UserId UNIQUEIDENTIFIER
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
    WHERE TID_UserId = @UserId
    ORDER BY TD_CreatedAt DESC;
END;
GO
