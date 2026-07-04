CREATE PROCEDURE dbo.usp_InventoryMovement_GetByProductId
    @ProductId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_Id AS Id,
        TID_ProductId AS ProductId,
        TC_MovementType AS MovementType,
        TN_Quantity AS Quantity,
        TN_PreviousStock AS PreviousStock,
        TN_NewStock AS NewStock,
        TID_ReferenceOrderId AS ReferenceOrderId,
        TD_CreatedAt AS CreatedAt
    FROM dbo.InventoryMovement
    WHERE TID_ProductId = @ProductId
    ORDER BY TD_CreatedAt DESC;
END;
GO
