CREATE PROCEDURE dbo.usp_Review_GetByUserId
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        R.TID_Id AS Id,
        R.TID_UserId AS UserId,
        R.TID_ProductId AS ProductId,
        P.TC_Name AS ProductName,
        R.TID_OrderId AS OrderId,
        R.TN_Rating AS Rating,
        R.TC_Comment AS Comment,
        R.TD_CreatedAt AS CreatedAt
    FROM dbo.Review R
    INNER JOIN dbo.Product P ON P.TID_Id = R.TID_ProductId
    WHERE R.TID_UserId = @UserId
    ORDER BY R.TD_CreatedAt DESC;
END;
GO
