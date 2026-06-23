CREATE PROCEDURE dbo.usp_PasswordResetToken_Insert
    @UserId UNIQUEIDENTIFIER,
    @TokenHash NVARCHAR(255),
    @ExpiresAt DATETIME2,
    @NewId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @NewId = NEWID();

    INSERT INTO dbo.PasswordResetTokens
    (
        Id,
        UserId,
        TokenHash,
        ExpiresAt
    )
    VALUES
    (
        @NewId,
        @UserId,
        @TokenHash,
        @ExpiresAt
    );
END;
GO