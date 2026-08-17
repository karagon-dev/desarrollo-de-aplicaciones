CREATE OR ALTER PROCEDURE dbo.usp_User_GetAll
    @RoleId INT = NULL,
    @IncludeInactive BIT = 0
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
    FROM dbo.[User] U
    INNER JOIN dbo.Role R ON R.TID_Id = U.TN_RoleId
    WHERE
        (@IncludeInactive = 1 OR U.TB_IsActive = 1)
        AND (@RoleId IS NULL OR U.TN_RoleId = @RoleId)
    ORDER BY U.TC_Email ASC;
END;
GO
