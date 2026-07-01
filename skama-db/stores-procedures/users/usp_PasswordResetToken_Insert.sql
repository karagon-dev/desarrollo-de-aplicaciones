CREATE PROCEDURE dbo.usp_PasswordResetToken_Insert
    @UserId UNIQUEIDENTIFIER,
    @TokenHash NVARCHAR(255),
    @ExpiresAt DATETIME2,
    @NewId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @NewId = NEWID();

    INSERT INTO dbo.PasswordResetToken
    (
        TID_Id,
        TID_UserId,
        TC_TokenHash,
        TD_ExpiresAt
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
