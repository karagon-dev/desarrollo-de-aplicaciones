CREATE PROCEDURE dbo.usp_CustomerProfile_GetByUserId
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        UserId,
        IdentificationNumber,
        FirstName,
        LastName,
        BirthDate,
        Phone,
        CreatedAt,
        UpdatedAt
    FROM dbo.CustomerProfiles
    WHERE UserId = @UserId;
END;
GO