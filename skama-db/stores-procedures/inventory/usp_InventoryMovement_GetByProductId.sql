CREATE PROCEDURE dbo.usp_InventoryMovement_GetByProductId
    @ProductId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        ProductId,
        MovementType,
        Quantity,
        PreviousStock,
        NewStock,
        ReferenceOrderId,
        CreatedAt
    FROM dbo.InventoryMovements
    WHERE ProductId = @ProductId
    ORDER BY CreatedAt DESC;
END;
GO