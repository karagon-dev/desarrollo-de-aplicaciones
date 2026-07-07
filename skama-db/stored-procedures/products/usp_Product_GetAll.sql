CREATE PROCEDURE dbo.usp_Product_GetAll
    @Search NVARCHAR(150) = NULL,
    @CategoryId UNIQUEIDENTIFIER = NULL,
    @IncludeInactive BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.TID_Id AS Id,
        P.TID_CategoryId AS CategoryId,
        C.TC_Name AS CategoryName,
        P.TC_Name AS Name,
        P.TC_Description AS Description,
        P.TN_Price AS Price,
        P.TN_StockQuantity AS StockQuantity,
        P.TN_MinimumStock AS MinimumStock,
        P.TB_IsActive AS IsActive,
        P.TD_CreatedAt AS CreatedAt,
        P.TD_UpdatedAt AS UpdatedAt
    FROM dbo.Product P
    INNER JOIN dbo.Category C ON C.TID_Id = P.TID_CategoryId
    WHERE
        (@IncludeInactive = 1 OR P.TB_IsActive = 1)
        AND (@CategoryId IS NULL OR P.TID_CategoryId = @CategoryId)
        AND (
            @Search IS NULL
            OR P.TC_Name LIKE '%' + @Search + '%'
            OR P.TC_Description LIKE '%' + @Search + '%'
            OR C.TC_Name LIKE '%' + @Search + '%'
        )
    ORDER BY P.TC_Name;
END;
GO
