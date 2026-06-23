CREATE PROCEDURE dbo.usp_Product_Delete
    @Id UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Products
    SET
        IsActive = 0,
        UpdatedAt = GETDATE()
    WHERE Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO