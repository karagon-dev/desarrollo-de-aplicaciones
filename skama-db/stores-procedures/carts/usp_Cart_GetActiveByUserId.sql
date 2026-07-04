CREATE PROCEDURE dbo.usp_Cart_GetActiveByUserId
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        TID_Id AS Id,
        TID_UserId AS UserId,
        TC_Status AS Status,
        TD_CreatedAt AS CreatedAt,
        TD_UpdatedAt AS UpdatedAt
    FROM dbo.Cart
    WHERE TID_UserId = @UserId
      AND TC_Status = 'ACTIVE';
END;
GO
