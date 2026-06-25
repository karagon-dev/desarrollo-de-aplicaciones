CREATE PROCEDURE dbo.usp_Inventory_GetLowStock
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Name,
        StockQuantity,
        MinimumStock,
        IsActive
    FROM dbo.Products
    WHERE IsActive = 1
      AND StockQuantity <= MinimumStock
    ORDER BY StockQuantity ASC;
END;
GO