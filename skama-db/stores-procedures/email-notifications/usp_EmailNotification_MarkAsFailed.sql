CREATE PROCEDURE dbo.usp_EmailNotification_MarkAsFailed
    @Id UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.EmailNotifications
    SET Status = 'FAILED'
    WHERE Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO