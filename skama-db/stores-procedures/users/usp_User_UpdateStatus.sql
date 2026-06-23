CREATE PROCEDURE dbo.usp_User_UpdateStatus
    @Id UNIQUEIDENTIFIER,
    @IsActive BIT,
    @RowsAffected INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Users
    SET
        IsActive = @IsActive,
        UpdatedAt = SYSDATETIME()
    WHERE Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;
END;
GO