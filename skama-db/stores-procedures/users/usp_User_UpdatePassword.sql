CREATE PROCEDURE dbo.usp_User_UpdatePassword
    @UserId UNIQUEIDENTIFIER,
    @PasswordHash NVARCHAR(255),
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.User
    SET
        TC_PasswordHash = @PasswordHash,
        TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @UserId
      AND TB_IsActive = 1;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
