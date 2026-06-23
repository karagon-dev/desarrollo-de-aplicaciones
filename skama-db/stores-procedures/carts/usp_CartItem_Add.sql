CREATE PROCEDURE dbo.usp_CartItem_Add
    @CartId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @Quantity INT,
    @CartItemId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UnitPrice DECIMAL(10,2);
    DECLARE @StockQuantity INT;
    DECLARE @ExistingQuantity INT = 0;
    DECLARE @RequestedTotalQuantity INT;

    IF @Quantity <= 0
    BEGIN
        SET @ResultCode = 2; -- VALIDATION_ERROR
        RETURN;
    END;

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.Carts
        WHERE Id = @CartId
          AND Status = 'ACTIVE'
    )
    BEGIN
        SET @ResultCode = 31; -- CART_NOT_ACTIVE
        RETURN;
    END;

    SELECT
        @UnitPrice = Price,
        @StockQuantity = StockQuantity
    FROM dbo.Products
    WHERE Id = @ProductId
      AND IsActive = 1;

    IF @UnitPrice IS NULL
    BEGIN
        SET @ResultCode = 20; -- PRODUCT_NOT_FOUND
        RETURN;
    END;

    SELECT
        @ExistingQuantity = Quantity
    FROM dbo.CartItems
    WHERE CartId = @CartId
      AND ProductId = @ProductId;

    SET @RequestedTotalQuantity = @ExistingQuantity + @Quantity;

    IF @RequestedTotalQuantity > @StockQuantity
    BEGIN
        SET @ResultCode = 22; -- INSUFFICIENT_STOCK
        RETURN;
    END;

    IF @ExistingQuantity > 0
    BEGIN
        UPDATE dbo.CartItems
        SET
            Quantity = @RequestedTotalQuantity,
            UnitPrice = @UnitPrice
        WHERE CartId = @CartId
          AND ProductId = @ProductId;

        SELECT
            @CartItemId = Id
        FROM dbo.CartItems
        WHERE CartId = @CartId
          AND ProductId = @ProductId;
    END
    ELSE
    BEGIN
        SET @CartItemId = NEWID();

        INSERT INTO dbo.CartItems
        (
            Id,
            CartId,
            ProductId,
            Quantity,
            UnitPrice
        )
        VALUES
        (
            @CartItemId,
            @CartId,
            @ProductId,
            @Quantity,
            @UnitPrice
        );
    END;

    UPDATE dbo.Carts
    SET UpdatedAt = SYSDATETIME()
    WHERE Id = @CartId;

    SET @ResultCode = 0; -- SUCCESS
END;
GO