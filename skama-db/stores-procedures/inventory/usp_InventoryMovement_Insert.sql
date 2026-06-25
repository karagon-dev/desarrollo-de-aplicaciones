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

    SELECT @PreviousStock = StockQuantity
    FROM dbo.Products
    WHERE Id = @ProductId;

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

    UPDATE dbo.Products
    SET
        StockQuantity = @NewStock,
        UpdatedAt = SYSDATETIME()
    WHERE Id = @ProductId;

    SET @NewId = NEWID();

    INSERT INTO dbo.InventoryMovements
    (
        Id,
        ProductId,
        MovementType,
        Quantity,
        PreviousStock,
        NewStock,
        ReferenceOrderId
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