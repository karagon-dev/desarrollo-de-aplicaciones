CREATE PROCEDURE dbo.usp_PasswordResetToken_GetValid
    @TokenHash NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_Id AS Id,
        TID_UserId AS UserId,
        TC_TokenHash AS TokenHash,
        TD_ExpiresAt AS ExpiresAt,
        TD_UsedAt AS UsedAt,
        TD_CreatedAt AS CreatedAt
    FROM dbo.PasswordResetToken
    WHERE TC_TokenHash = @TokenHash
      AND TD_UsedAt IS NULL
      AND TD_ExpiresAt > SYSDATETIME();
END;
GO
