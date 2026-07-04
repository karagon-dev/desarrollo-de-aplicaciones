CREATE PROCEDURE dbo.usp_CustomerProfile_GetByUserId
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TID_Id AS Id,
        TID_UserId AS UserId,
        TC_IdentificationNumber AS IdentificationNumber,
        TC_FirstName AS FirstName,
        TC_LastName AS LastName,
        TD_BirthDate AS BirthDate,
        TC_Phone AS Phone,
        TD_CreatedAt AS CreatedAt,
        TD_UpdatedAt AS UpdatedAt
    FROM dbo.CustomerProfile
    WHERE TID_UserId = @UserId;
END;
GO
