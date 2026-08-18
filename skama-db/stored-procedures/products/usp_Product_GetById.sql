CREATE OR ALTER PROCEDURE dbo.usp_Product_GetById
    @Id UNIQUEIDENTIFIER
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
        Img.MainImageUrl,
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
    OUTER APPLY
    (
        SELECT TOP 1
            CASE
                WHEN PI.TC_ImageUrl LIKE 'http%' THEN PI.TC_ImageUrl
                WHEN PI.TC_ImageUrl LIKE '/%' THEN PI.TC_ImageUrl
                ELSE '/images/products/' + PI.TC_ImageUrl
            END AS MainImageUrl
        FROM dbo.ProductImage PI
        WHERE PI.TID_ProductId = P.TID_Id
        ORDER BY PI.TB_IsMain DESC, PI.TN_SortOrder ASC
    ) Img
    WHERE P.TID_Id = @Id;
END;
GO

