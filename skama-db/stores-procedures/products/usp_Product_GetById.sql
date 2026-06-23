CREATE PROCEDURE dbo.usp_Product_GetById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.Id,
        P.CategoryId,
        C.Name AS CategoryName,
        P.Name,
        P.Description,
        P.Price,
        P.StockQuantity,
        P.MinimumStock,
        P.IsActive,
        P.CreatedAt,
        P.UpdatedAt
    FROM dbo.Products P
    INNER JOIN dbo.Categories C ON C.Id = P.CategoryId
    WHERE P.Id = @Id;
END;
GO