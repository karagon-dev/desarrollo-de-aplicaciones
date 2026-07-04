CREATE PROCEDURE dbo.usp_Category_Insert
    @Name NVARCHAR(100),
    @Description NVARCHAR(255) = NULL,
    @NewId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @NewId = NEWID();

    INSERT INTO dbo.Category
    (
        TID_Id,
        TC_Name,
        TC_Description,
        TB_IsActive,
        TD_CreatedAt,
        TD_UpdatedAt
    )
    VALUES
    (
        @NewId,
        @Name,
        @Description,
        1,
        GETDATE(),
        GETDATE()
    );
END;
GO
