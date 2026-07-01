CREATE PROCEDURE dbo.usp_Product_Delete
    @Id UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Product
    SET
        TB_IsActive = 0,
        TD_UpdatedAt = GETDATE()
    WHERE TID_Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
