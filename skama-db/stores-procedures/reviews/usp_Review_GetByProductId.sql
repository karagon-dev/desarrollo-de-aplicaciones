CREATE PROCEDURE dbo.usp_Review_GetByProductId
    @ProductId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        R.Id,
        R.UserId,
        R.ProductId,
        R.OrderId,
        R.Rating,
        R.Comment,
        R.CreatedAt
    FROM dbo.Reviews R
    WHERE R.ProductId = @ProductId
    ORDER BY R.CreatedAt DESC;
END;
GO