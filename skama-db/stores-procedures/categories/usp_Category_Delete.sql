CREATE PROCEDURE dbo.usp_Category_Delete
    @Id UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Categories
    SET
        IsActive = 0,
        UpdatedAt = GETDATE()
    WHERE Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO