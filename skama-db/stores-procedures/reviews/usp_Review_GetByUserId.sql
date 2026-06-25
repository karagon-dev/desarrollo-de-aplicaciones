CREATE PROCEDURE dbo.usp_Review_GetByUserId
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        R.Id,
        R.UserId,
        R.ProductId,
        P.Name AS ProductName,
        R.OrderId,
        R.Rating,
        R.Comment,
        R.CreatedAt
    FROM dbo.Reviews R
    INNER JOIN dbo.Products P ON P.Id = R.ProductId
    WHERE R.UserId = @UserId
    ORDER BY R.CreatedAt DESC;
END;
GO