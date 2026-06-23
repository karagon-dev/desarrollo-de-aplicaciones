CREATE PROCEDURE dbo.usp_CustomerProfile_InsertOrUpdate
    @UserId UNIQUEIDENTIFIER,
    @IdentificationNumber NVARCHAR(30),
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(150),
    @BirthDate DATE = NULL,
    @Phone NVARCHAR(30) = NULL,
    @ProfileId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM dbo.CustomerProfiles
        WHERE IdentificationNumber = @IdentificationNumber
          AND UserId <> @UserId
    )
    BEGIN
        SET @ResultCode = 1; -- Identification already exists
        RETURN;
    END;

    IF EXISTS (SELECT 1 FROM dbo.CustomerProfiles WHERE UserId = @UserId)
    BEGIN
        UPDATE dbo.CustomerProfiles
        SET
            IdentificationNumber = @IdentificationNumber,
            FirstName = @FirstName,
            LastName = @LastName,
            BirthDate = @BirthDate,
            Phone = @Phone,
            UpdatedAt = SYSDATETIME()
        WHERE UserId = @UserId;

        SELECT @ProfileId = Id
        FROM dbo.CustomerProfiles
        WHERE UserId = @UserId;

        SET @ResultCode = 0;
        RETURN;
    END;

    SET @ProfileId = NEWID();

    INSERT INTO dbo.CustomerProfiles
    (
        Id,
        UserId,
        IdentificationNumber,
        FirstName,
        LastName,
        BirthDate,
        Phone,
        CreatedAt,
        UpdatedAt
    )
    VALUES
    (
        @ProfileId,
        @UserId,
        @IdentificationNumber,
        @FirstName,
        @LastName,
        @BirthDate,
        @Phone,
        SYSDATETIME(),
        NULL
    );

    SET @ResultCode = 0;
END;
GO