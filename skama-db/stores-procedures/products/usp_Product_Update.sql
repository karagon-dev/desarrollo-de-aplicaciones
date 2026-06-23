CREATE PROCEDURE dbo.usp_Product_Update
    @Id UNIQUEIDENTIFIER,
    @CategoryId UNIQUEIDENTIFIER,
    @Name NVARCHAR(150),
    @Description NVARCHAR(500) = NULL,
    @Price DECIMAL(10,2),
    @StockQuantity INT,
    @MinimumStock INT,
    @IsActive BIT,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Products
    SET
        CategoryId = @CategoryId,
        Name = @Name,
        Description = @Description,
        Price = @Price,
        StockQuantity = @StockQuantity,
        MinimumStock = @MinimumStock,
        IsActive = @IsActive,
        UpdatedAt = GETDATE()
    WHERE Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO