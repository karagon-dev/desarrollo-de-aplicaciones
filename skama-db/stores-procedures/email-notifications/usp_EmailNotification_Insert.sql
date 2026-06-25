CREATE PROCEDURE dbo.usp_EmailNotification_Insert
    @UserId UNIQUEIDENTIFIER,
    @OrderId UNIQUEIDENTIFIER = NULL,
    @Type NVARCHAR(50),
    @RecipientEmail NVARCHAR(150),
    @Subject NVARCHAR(255),
    @NewId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF @Type NOT IN ('ORDER_CONFIRMATION', 'ORDER_STATUS_UPDATE', 'PASSWORD_RESET')
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    SET @NewId = NEWID();

    INSERT INTO dbo.EmailNotifications
    (
        Id,
        UserId,
        OrderId,
        Type,
        RecipientEmail,
        Subject,
        Status
    )
    VALUES
    (
        @NewId,
        @UserId,
        @OrderId,
        @Type,
        @RecipientEmail,
        @Subject,
        'PENDING'
    );

    SET @ResultCode = 0;
END;
GO