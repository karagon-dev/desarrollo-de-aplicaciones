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
        FROM dbo.CustomerProfile
        WHERE TC_IdentificationNumber = @IdentificationNumber
          AND TID_UserId <> @UserId
    )
    BEGIN
        SET @ResultCode = 1; -- Identification already exists
        RETURN;
    END;

    IF EXISTS (SELECT 1 FROM dbo.CustomerProfile WHERE TID_UserId = @UserId)
    BEGIN
        UPDATE dbo.CustomerProfile
        SET
            TC_IdentificationNumber = @IdentificationNumber,
            TC_FirstName = @FirstName,
            TC_LastName = @LastName,
            TD_BirthDate = @BirthDate,
            TC_Phone = @Phone,
            TD_UpdatedAt = SYSDATETIME()
        WHERE TID_UserId = @UserId;

        SELECT @ProfileId = TID_Id
        FROM dbo.CustomerProfile
        WHERE TID_UserId = @UserId;

        SET @ResultCode = 0;
        RETURN;
    END;

    SET @ProfileId = NEWID();

    INSERT INTO dbo.CustomerProfile
    (
        TID_Id,
        TID_UserId,
        TC_IdentificationNumber,
        TC_FirstName,
        TC_LastName,
        TD_BirthDate,
        TC_Phone,
        TD_CreatedAt,
        TD_UpdatedAt
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
