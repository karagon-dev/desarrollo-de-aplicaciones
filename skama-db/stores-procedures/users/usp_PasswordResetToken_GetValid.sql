CREATE PROCEDURE dbo.usp_PasswordResetToken_GetValid
    @TokenHash NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        UserId,
        TokenHash,
        ExpiresAt,
        UsedAt,
        CreatedAt
    FROM dbo.PasswordResetTokens
    WHERE TokenHash = @TokenHash
      AND UsedAt IS NULL
      AND ExpiresAt > SYSDATETIME();
END;
GO