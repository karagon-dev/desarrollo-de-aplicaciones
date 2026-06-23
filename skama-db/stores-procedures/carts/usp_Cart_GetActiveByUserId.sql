CREATE PROCEDURE dbo.usp_Cart_GetActiveByUserId
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        Id,
        UserId,
        Status,
        CreatedAt,
        UpdatedAt
    FROM dbo.Carts
    WHERE UserId = @UserId
      AND Status = 'ACTIVE';
END;
GO