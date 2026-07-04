CREATE PROCEDURE dbo.usp_InventoryMovement_Insert
    @ProductId UNIQUEIDENTIFIER,
    @MovementType NVARCHAR(30),
    @Quantity INT,
    @ReferenceOrderId UNIQUEIDENTIFIER = NULL,
    @NewId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PreviousStock INT;
    DECLARE @NewStock INT;

    IF @MovementType NOT IN ('SALE', 'RETURN', 'MANUAL_ADJUSTMENT')
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    IF @Quantity <= 0
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    SELECT @PreviousStock = TN_StockQuantity
    FROM dbo.Product
    WHERE TID_Id = @ProductId;

    IF @PreviousStock IS NULL
    BEGIN
        SET @ResultCode = 20;
        RETURN;
    END;

    IF @MovementType = 'SALE'
        SET @NewStock = @PreviousStock - @Quantity;
    ELSE
        SET @NewStock = @PreviousStock + @Quantity;

    IF @NewStock < 0
    BEGIN
        SET @ResultCode = 22;
        RETURN;
    END;

    UPDATE dbo.Product
    SET
        TN_StockQuantity = @NewStock,
        TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @ProductId;

    SET @NewId = NEWID();

    INSERT INTO dbo.InventoryMovement
    (
        TID_Id,
        TID_ProductId,
        TC_MovementType,
        TN_Quantity,
        TN_PreviousStock,
        TN_NewStock,
        TID_ReferenceOrderId
    )
    VALUES
    (
        @NewId,
        @ProductId,
        @MovementType,
        @Quantity,
        @PreviousStock,
        @NewStock,
        @ReferenceOrderId
    );

    SET @ResultCode = 0;
END;
GO
