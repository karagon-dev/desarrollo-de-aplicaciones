CREATE PROCEDURE dbo.usp_PasswordResetToken_MarkAsUsed
    @Id UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.PasswordResetTokens
    SET UsedAt = SYSDATETIME()
    WHERE Id = @Id
      AND UsedAt IS NULL;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO