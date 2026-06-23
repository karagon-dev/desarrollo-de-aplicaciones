CREATE PROCEDURE dbo.usp_Product_GetAll
    @Search NVARCHAR(150) = NULL,
    @CategoryId UNIQUEIDENTIFIER = NULL,
    @IncludeInactive BIT = 0
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
    WHERE
        (@IncludeInactive = 1 OR P.IsActive = 1)
        AND (@CategoryId IS NULL OR P.CategoryId = @CategoryId)
        AND (
            @Search IS NULL
            OR P.Name LIKE '%' + @Search + '%'
            OR P.Description LIKE '%' + @Search + '%'
            OR C.Name LIKE '%' + @Search + '%'
        )
    ORDER BY P.Name;
END;
GO