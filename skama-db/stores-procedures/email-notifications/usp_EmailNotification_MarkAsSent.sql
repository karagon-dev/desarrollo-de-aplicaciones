CREATE PROCEDURE dbo.usp_EmailNotification_MarkAsSent
    @Id UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.EmailNotifications
    SET
        Status = 'SENT',
        SentAt = SYSDATETIME()
    WHERE Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO