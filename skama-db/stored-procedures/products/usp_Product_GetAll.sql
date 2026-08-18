CREATE OR ALTER PROCEDURE dbo.usp_Product_GetAll
    @Search NVARCHAR(150) = NULL,
    @CategoryId UNIQUEIDENTIFIER = NULL,
    @IncludeInactive BIT = 0,
    @IncludeUnavailable BIT = 0
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
        ISNULL(Promo.DiscountPercentage, 0) AS DiscountPercentage,
        Promo.PromotionName,
        P.TN_StockQuantity AS StockQuantity,
        P.TN_MinimumStock AS MinimumStock,
        P.TB_IsLimitedEdition AS IsLimitedEdition,
        P.TB_IsActive AS IsActive,
        P.TD_CreatedAt AS CreatedAt,
        P.TD_UpdatedAt AS UpdatedAt
    FROM dbo.Product P
    INNER JOIN dbo.Category C ON C.TID_Id = P.TID_CategoryId
    OUTER APPLY
    (
        SELECT TOP 1
            PR.TN_DiscountPercentage AS DiscountPercentage,
            PR.TC_Name AS PromotionName
        FROM dbo.PromotionProduct PP
        INNER JOIN dbo.Promotion PR ON PR.TID_Id = PP.TID_PromotionId
        WHERE PP.TID_ProductId = P.TID_Id
          AND PR.TB_IsActive = 1
          AND CAST(SYSDATETIME() AS DATE) BETWEEN PR.TD_StartDate AND PR.TD_EndDate
        ORDER BY PR.TN_DiscountPercentage DESC
    ) Promo
    WHERE
        (@IncludeInactive = 1 OR P.TB_IsActive = 1)
        AND (@IncludeUnavailable = 1 OR P.TN_StockQuantity > 0)
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

