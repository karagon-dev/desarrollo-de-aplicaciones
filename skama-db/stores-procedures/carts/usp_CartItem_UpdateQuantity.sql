CREATE PROCEDURE dbo.usp_CartItem_UpdateQuantity
    @CartItemId UNIQUEIDENTIFIER,
    @Quantity INT,
    @RowsAffected INT OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CartId UNIQUEIDENTIFIER;
    DECLARE @ProductId UNIQUEIDENTIFIER;
    DECLARE @StockQuantity INT;

    IF @Quantity <= 0
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    SELECT
        @CartId = CI.CartId,
        @ProductId = CI.ProductId
    FROM dbo.CartItems CI
    INNER JOIN dbo.Carts C ON C.Id = CI.CartId
    WHERE CI.Id = @CartItemId
      AND C.Status = 'ACTIVE';

    IF @CartId IS NULL
    BEGIN
        SET @ResultCode = 30;
        RETURN;
    END;

    SELECT @StockQuantity = StockQuantity
    FROM dbo.Products
    WHERE Id = @ProductId
      AND IsActive = 1;

    IF @StockQuantity IS NULL
    BEGIN
        SET @ResultCode = 20;
        RETURN;
    END;

    IF @Quantity > @StockQuantity
    BEGIN
        SET @ResultCode = 22;
        RETURN;
    END;

    UPDATE dbo.CartItems
    SET Quantity = @Quantity
    WHERE Id = @CartItemId;

    SET @RowsAffected = @@ROWCOUNT;

    UPDATE dbo.Carts
    SET UpdatedAt = SYSDATETIME()
    WHERE Id = @CartId;

    SET @ResultCode = 0;
END;
GO