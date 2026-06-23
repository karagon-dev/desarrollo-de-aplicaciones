CREATE PROCEDURE dbo.usp_Cart_GetDetail
    @CartId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        C.Id,
        C.UserId,
        C.Status,
        C.CreatedAt,
        C.UpdatedAt
    FROM dbo.Carts C
    WHERE C.Id = @CartId;

    SELECT
        CI.Id,
        CI.CartId,
        CI.ProductId,
        P.Name AS ProductName,
        CI.Quantity,
        CI.UnitPrice,
        CI.Quantity * CI.UnitPrice AS Subtotal,
        P.StockQuantity,
        P.IsActive
    FROM dbo.CartItems CI
    INNER JOIN dbo.Products P ON P.Id = CI.ProductId
    WHERE CI.CartId = @CartId
    ORDER BY P.Name;

    SELECT
        SUM(CI.Quantity * CI.UnitPrice) AS Total
    FROM dbo.CartItems CI
    WHERE CI.CartId = @CartId;
END;
GO