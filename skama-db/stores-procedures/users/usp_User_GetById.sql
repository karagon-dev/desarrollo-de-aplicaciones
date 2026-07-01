CREATE PROCEDURE dbo.usp_User_GetById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        U.TID_Id AS Id,
        U.TN_RoleId AS RoleId,
        R.TC_Name AS RoleName,
        U.TC_Email AS Email,
        U.TB_IsActive AS IsActive,
        U.TD_CreatedAt AS CreatedAt,
        U.TD_UpdatedAt AS UpdatedAt
    FROM dbo.User U
    INNER JOIN dbo.Role R ON R.TID_Id = U.TN_RoleId
    WHERE U.TID_Id = @Id;
END;
GO
