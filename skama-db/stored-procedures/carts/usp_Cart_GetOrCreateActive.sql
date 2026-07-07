CREATE PROCEDURE dbo.usp_Cart_GetOrCreateActive
    @UserId UNIQUEIDENTIFIER,
    @CartId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        @CartId = TID_Id
    FROM dbo.Cart
    WHERE TID_UserId = @UserId
      AND TC_Status = 'ACTIVE';

    IF @CartId IS NULL
    BEGIN
        SET @CartId = NEWID();

        INSERT INTO dbo.Cart
        (
            TID_Id,
            TID_UserId,
            TC_Status
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
