CREATE PROCEDURE dbo.usp_Cart_GetOrCreateActive
    @UserId UNIQUEIDENTIFIER,
    @CartId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        @CartId = Id
    FROM dbo.Carts
    WHERE UserId = @UserId
      AND Status = 'ACTIVE';

    IF @CartId IS NULL
    BEGIN
        SET @CartId = NEWID();

        INSERT INTO dbo.Carts
        (
            Id,
            UserId,
            Status
        )
        VALUES
        (
            @CartId,
            @UserId,
            'ACTIVE'
        );
    END;
END;
GO