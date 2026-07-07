CREATE PROCEDURE dbo.usp_PasswordResetToken_MarkAsUsed
    @Id UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.PasswordResetToken
    SET TD_UsedAt = SYSDATETIME()
    WHERE TID_Id = @Id
      AND TD_UsedAt IS NULL;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
