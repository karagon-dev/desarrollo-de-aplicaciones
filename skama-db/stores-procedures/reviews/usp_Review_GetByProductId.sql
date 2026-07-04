CREATE PROCEDURE dbo.usp_Review_GetByProductId
    @ProductId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        R.TID_Id AS Id,
        R.TID_UserId AS UserId,
        R.TID_ProductId AS ProductId,
        R.TID_OrderId AS OrderId,
        R.TN_Rating AS Rating,
        R.TC_Comment AS Comment,
        R.TD_CreatedAt AS CreatedAt
    FROM dbo.Review R
    WHERE R.TID_ProductId = @ProductId
    ORDER BY R.TD_CreatedAt DESC;
END;
GO
