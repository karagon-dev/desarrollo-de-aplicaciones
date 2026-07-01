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
        FROM dbo.Cart
        WHERE TID_Id = @CartId
          AND TC_Status = 'ACTIVE'
    )
    BEGIN
        SET @ResultCode = 31; -- CART_NOT_ACTIVE
        RETURN;
    END;

    SELECT
        @UnitPrice = TN_Price,
        @StockQuantity = TN_StockQuantity
    FROM dbo.Product
    WHERE TID_Id = @ProductId
      AND TB_IsActive = 1;

    IF @UnitPrice IS NULL
    BEGIN
        SET @ResultCode = 20; -- PRODUCT_NOT_FOUND
        RETURN;
    END;

    SELECT
        @ExistingQuantity = TN_Quantity
    FROM dbo.CartItem
    WHERE TID_CartId = @CartId
      AND TID_ProductId = @ProductId;

    SET @RequestedTotalQuantity = @ExistingQuantity + @Quantity;

    IF @RequestedTotalQuantity > @StockQuantity
    BEGIN
        SET @ResultCode = 22; -- INSUFFICIENT_STOCK
        RETURN;
    END;

    IF @ExistingQuantity > 0
    BEGIN
        UPDATE dbo.CartItem
        SET
            TN_Quantity = @RequestedTotalQuantity,
            TN_UnitPrice = @UnitPrice
        WHERE TID_CartId = @CartId
          AND TID_ProductId = @ProductId;

        SELECT
            @CartItemId = TID_Id
        FROM dbo.CartItem
        WHERE TID_CartId = @CartId
          AND TID_ProductId = @ProductId;
    END
    ELSE
    BEGIN
        SET @CartItemId = NEWID();

        INSERT INTO dbo.CartItem
        (
            TID_Id,
            TID_CartId,
            TID_ProductId,
            TN_Quantity,
            TN_UnitPrice
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

    UPDATE dbo.Cart
    SET TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @CartId;

    SET @ResultCode = 0; -- SUCCESS
END;
GO
