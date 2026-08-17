CREATE OR ALTER PROCEDURE dbo.usp_Product_Insert
    @CategoryId UNIQUEIDENTIFIER,
    @Name NVARCHAR(150),
    @Description NVARCHAR(500) = NULL,
    @Price DECIMAL(10,2),
    @StockQuantity INT,
    @MinimumStock INT,
    @IsLimitedEdition BIT = 0,
    @NewId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @NewId = NEWID();

    INSERT INTO dbo.Product
    (
        TID_Id,
        TID_CategoryId,
        TC_Name,
        TC_Description,
        TN_Price,
        TN_StockQuantity,
        TN_MinimumStock,
        TB_IsLimitedEdition,
        TB_IsActive,
        TD_CreatedAt,
        TD_UpdatedAt
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
        @IsLimitedEdition,
        1,
        GETDATE(),
        GETDATE()
    );
END;
GO

