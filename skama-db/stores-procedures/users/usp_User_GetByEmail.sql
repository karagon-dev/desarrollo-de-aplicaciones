CREATE PROCEDURE dbo.usp_User_GetByEmail
    @Email NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        U.Id,
        U.RoleId,
        R.Name AS RoleName,
        U.Email,
        U.PasswordHash,
        U.IsActive,
        U.CreatedAt,
        U.UpdatedAt
    FROM dbo.Users U
    INNER JOIN dbo.Roles R ON R.Id = U.RoleId
    WHERE U.Email = @Email;
END;
GO