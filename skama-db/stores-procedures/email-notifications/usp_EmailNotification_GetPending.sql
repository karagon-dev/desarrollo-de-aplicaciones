CREATE PROCEDURE dbo.usp_EmailNotification_GetPending
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_Id AS Id,
        TID_UserId AS UserId,
        TID_OrderId AS OrderId,
        TC_Type AS Type,
        TC_RecipientEmail AS RecipientEmail,
        TC_Subject AS Subject,
        TC_Status AS Status,
        TD_SentAt AS SentAt,
        TD_CreatedAt AS CreatedAt
    FROM dbo.EmailNotification
    WHERE TC_Status = 'PENDING'
    ORDER BY TD_CreatedAt ASC;
END;
GO
