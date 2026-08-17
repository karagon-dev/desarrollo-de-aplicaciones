CREATE OR ALTER PROCEDURE dbo.usp_Inventory_GetLowStock
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_Id AS Id,
        TC_Name AS Name,
        TN_StockQuantity AS StockQuantity,
        TN_MinimumStock AS MinimumStock,
        TB_IsActive AS IsActive
    FROM dbo.Product
    WHERE TB_IsActive = 1
      AND TN_StockQuantity < 3
    ORDER BY TC_Name ASC;
END;
GO

