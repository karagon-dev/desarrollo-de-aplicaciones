CREATE PROCEDURE dbo.usp_EmailNotification_MarkAsFailed
    @Id UNIQUEIDENTIFIER,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.EmailNotification
    SET TC_Status = 'FAILED'
    WHERE TID_Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO
