CREATE OR ALTER PROCEDURE dbo.usp_Cart_GetDetail
    @CartId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        C.TID_Id AS Id,
        C.TID_UserId AS UserId,
        C.TC_Status AS Status,
        C.TD_CreatedAt AS CreatedAt,
        C.TD_UpdatedAt AS UpdatedAt
    FROM dbo.Cart C
    WHERE C.TID_Id = @CartId;

    SELECT
        CI.TID_Id AS Id,
        CI.TID_CartId AS CartId,
        CI.TID_ProductId AS ProductId,
        P.TC_Name AS ProductName,
        CI.TN_Quantity AS Quantity,
        ROUND(P.TN_Price * (1 - ISNULL(Promo.DiscountPercentage, 0) / 100.0), 2) AS UnitPrice,
        P.TN_Price AS OriginalUnitPrice,
        ISNULL(Promo.DiscountPercentage, 0) AS DiscountPercentage,
        CI.TN_Quantity * ROUND(P.TN_Price * (1 - ISNULL(Promo.DiscountPercentage, 0) / 100.0), 2) AS Subtotal,
        P.TN_StockQuantity AS StockQuantity,
        P.TB_IsActive AS IsActive
    FROM dbo.CartItem CI
    INNER JOIN dbo.Product P ON P.TID_Id = CI.TID_ProductId
    OUTER APPLY
    (
        SELECT TOP 1 PR.TN_DiscountPercentage AS DiscountPercentage
        FROM dbo.PromotionProduct PP
        INNER JOIN dbo.Promotion PR ON PR.TID_Id = PP.TID_PromotionId
        WHERE PP.TID_ProductId = P.TID_Id
          AND PR.TB_IsActive = 1
          AND CAST(SYSDATETIME() AS DATE) BETWEEN PR.TD_StartDate AND PR.TD_EndDate
        ORDER BY PR.TN_DiscountPercentage DESC
    ) Promo
    WHERE CI.TID_CartId = @CartId
    ORDER BY P.TC_Name;

    SELECT
        SUM(CI.TN_Quantity * ROUND(P.TN_Price * (1 - ISNULL(Promo.DiscountPercentage, 0) / 100.0), 2)) AS Total
    FROM dbo.CartItem CI
    INNER JOIN dbo.Product P ON P.TID_Id = CI.TID_ProductId
    OUTER APPLY
    (
        SELECT TOP 1 PR.TN_DiscountPercentage AS DiscountPercentage
        FROM dbo.PromotionProduct PP
        INNER JOIN dbo.Promotion PR ON PR.TID_Id = PP.TID_PromotionId
        WHERE PP.TID_ProductId = P.TID_Id
          AND PR.TB_IsActive = 1
          AND CAST(SYSDATETIME() AS DATE) BETWEEN PR.TD_StartDate AND PR.TD_EndDate
        ORDER BY PR.TN_DiscountPercentage DESC
    ) Promo
    WHERE CI.TID_CartId = @CartId;
END;
GO

