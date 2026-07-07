CREATE PROCEDURE dbo.usp_User_UpdateStatus
    @Id UNIQUEIDENTIFIER,
    @IsActive BIT,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.User
    SET
        TB_IsActive = @IsActive,
        TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
