CREATE PROCEDURE dbo.usp_User_Register
    @RoleId INT,
    @Email NVARCHAR(150),
    @PasswordHash NVARCHAR(255),
    @NewId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.User WHERE TC_Email = @Email)
    BEGIN
        SET @ResultCode = 1; -- TC_Email already exists
        RETURN;
    END;

    SET @NewId = NEWID();

    INSERT INTO dbo.User
    (
        TID_Id,
        TN_RoleId,
        TC_Email,
        TC_PasswordHash,
        TB_IsActive,
        TD_CreatedAt,
        TD_UpdatedAt
    )
    VALUES
    (
        @NewId,
        @RoleId,
        @Email,
        @PasswordHash,
        1,
        SYSDATETIME(),
        NULL
    );

    SET @ResultCode = 0; -- Success
END;
GO
