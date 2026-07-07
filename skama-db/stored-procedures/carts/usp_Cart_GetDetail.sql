CREATE PROCEDURE dbo.usp_Cart_GetDetail
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
        CI.TN_UnitPrice AS UnitPrice,
        CI.TN_Quantity * CI.TN_UnitPrice AS Subtotal,
        P.TN_StockQuantity AS StockQuantity,
        P.TB_IsActive AS IsActive
    FROM dbo.CartItem CI
    INNER JOIN dbo.Product P ON P.TID_Id = CI.TID_ProductId
    WHERE CI.TID_CartId = @CartId
    ORDER BY P.TC_Name;

    SELECT
        SUM(CI.TN_Quantity * CI.TN_UnitPrice) AS Total
    FROM dbo.CartItem CI
    WHERE CI.TID_CartId = @CartId;
END;
GO
