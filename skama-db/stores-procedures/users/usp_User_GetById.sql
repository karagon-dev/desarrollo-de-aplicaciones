CREATE PROCEDURE dbo.usp_User_GetById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        U.Id,
        U.RoleId,
        R.Name AS RoleName,
        U.Email,
        U.IsActive,
        U.CreatedAt,
        U.UpdatedAt
    FROM dbo.Users U
    INNER JOIN dbo.Roles R ON R.Id = U.RoleId
    WHERE U.Id = @Id;
END;
GO