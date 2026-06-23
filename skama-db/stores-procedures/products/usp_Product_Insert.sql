CREATE PROCEDURE dbo.usp_Product_Insert
    @CategoryId UNIQUEIDENTIFIER,
    @Name NVARCHAR(150),
    @Description NVARCHAR(500) = NULL,
    @Price DECIMAL(10,2),
    @StockQuantity INT,
    @MinimumStock INT,
    @NewId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @NewId = NEWID();

    INSERT INTO dbo.Products
    (
        Id,
        CategoryId,
        Name,
        Description,
        Price,
        StockQuantity,
        MinimumStock,
        IsActive,
        CreatedAt,
        UpdatedAt
    )
    VALUES
    (
        @NewId,
        @CategoryId,
        @Name,
        @Description,
        @Price,
        @StockQuantity,
        @MinimumStock,
        1,
        GETDATE(),
        GETDATE()
    );
END;
GO