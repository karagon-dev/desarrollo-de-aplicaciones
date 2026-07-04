CREATE PROCEDURE dbo.usp_Product_GetById
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
        P.TN_StockQuantity AS StockQuantity,
        P.TN_MinimumStock AS MinimumStock,
        P.TB_IsActive AS IsActive,
        P.TD_CreatedAt AS CreatedAt,
        P.TD_UpdatedAt AS UpdatedAt
    FROM dbo.Product P
    INNER JOIN dbo.Category C ON C.TID_Id = P.TID_CategoryId
    WHERE P.TID_Id = @Id;
END;
GO
