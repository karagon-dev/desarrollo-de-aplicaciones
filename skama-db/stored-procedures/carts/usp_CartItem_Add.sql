CREATE OR ALTER PROCEDURE dbo.usp_CartItem_Add
    @CartId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @Quantity INT,
    @CartItemId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UnitPrice DECIMAL(10,2);
    DECLARE @ListPrice DECIMAL(10,2);
    DECLARE @DiscountPercentage DECIMAL(5,2) = 0;
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
        @ListPrice = TN_Price,
        @StockQuantity = TN_StockQuantity
    FROM dbo.Product
    WHERE TID_Id = @ProductId
      AND TB_IsActive = 1;

    IF @ListPrice IS NULL
    BEGIN
        SET @ResultCode = 20; -- PRODUCT_NOT_FOUND
        RETURN;
    END;

    SELECT TOP 1
        @DiscountPercentage = PR.TN_DiscountPercentage
    FROM dbo.PromotionProduct PP
    INNER JOIN dbo.Promotion PR ON PR.TID_Id = PP.TID_PromotionId
    WHERE PP.TID_ProductId = @ProductId
      AND PR.TB_IsActive = 1
      AND CAST(SYSDATETIME() AS DATE) BETWEEN PR.TD_StartDate AND PR.TD_EndDate
    ORDER BY PR.TN_DiscountPercentage DESC;

    SET @UnitPrice = ROUND(@ListPrice * (1 - ISNULL(@DiscountPercentage, 0) / 100.0), 2);

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

