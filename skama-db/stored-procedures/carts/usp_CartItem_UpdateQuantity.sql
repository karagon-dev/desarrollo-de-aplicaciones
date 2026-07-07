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
        @CartId = CI.TID_CartId,
        @ProductId = CI.TID_ProductId
    FROM dbo.CartItem CI
    INNER JOIN dbo.Cart C ON C.TID_Id = CI.TID_CartId
    WHERE CI.TID_Id = @CartItemId
      AND C.TC_Status = 'ACTIVE';

    IF @CartId IS NULL
    BEGIN
        SET @ResultCode = 30;
        RETURN;
    END;

    SELECT @StockQuantity = TN_StockQuantity
    FROM dbo.Product
    WHERE TID_Id = @ProductId
      AND TB_IsActive = 1;

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

    UPDATE dbo.CartItem
    SET TN_Quantity = @Quantity
    WHERE TID_Id = @CartItemId;

    SET @RowsAffected = @@ROWCOUNT;

    UPDATE dbo.Cart
    SET TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @CartId;

    SET @ResultCode = 0;
END;
GO
