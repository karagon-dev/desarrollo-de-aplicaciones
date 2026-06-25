CREATE PROCEDURE dbo.usp_EmailNotification_GetPending
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        UserId,
        OrderId,
        Type,
        RecipientEmail,
        Subject,
        Status,
        SentAt,
        CreatedAt
    FROM dbo.EmailNotifications
    WHERE Status = 'PENDING'
    ORDER BY CreatedAt ASC;
END;
GO