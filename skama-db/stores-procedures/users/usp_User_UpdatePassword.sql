CREATE PROCEDURE dbo.usp_User_UpdatePassword
    @UserId UNIQUEIDENTIFIER,
    @PasswordHash NVARCHAR(255),
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Users
    SET
        PasswordHash = @PasswordHash,
        UpdatedAt = SYSDATETIME()
    WHERE Id = @UserId
      AND IsActive = 1;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
