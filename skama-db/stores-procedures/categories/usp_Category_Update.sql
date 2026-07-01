CREATE PROCEDURE dbo.usp_Category_Update
    @Id UNIQUEIDENTIFIER,
    @Name NVARCHAR(100),
    @Description NVARCHAR(255) = NULL,
    @IsActive BIT,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Category
    SET
        TC_Name = @Name,
        TC_Description = @Description,
        TB_IsActive = @IsActive,
        TD_UpdatedAt = GETDATE()
    WHERE TID_Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
