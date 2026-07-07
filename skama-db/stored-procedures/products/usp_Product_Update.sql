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

    UPDATE dbo.Product
    SET
        TID_CategoryId = @CategoryId,
        TC_Name = @Name,
        TC_Description = @Description,
        TN_Price = @Price,
        TN_StockQuantity = @StockQuantity,
        TN_MinimumStock = @MinimumStock,
        TB_IsActive = @IsActive,
        TD_UpdatedAt = GETDATE()
    WHERE TID_Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
