CREATE PROCEDURE dbo.usp_EmailNotification_MarkAsSent
    @Id UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.EmailNotification
    SET
        TC_Status = 'SENT',
        TD_SentAt = SYSDATETIME()
    WHERE TID_Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
