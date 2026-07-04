CREATE PROCEDURE dbo.usp_Review_Insert
    @UserId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @OrderId UNIQUEIDENTIFIER,
    @Rating INT,
    @Comment NVARCHAR(1000) = NULL,
    @NewId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF @Rating < 1 OR @Rating > 5
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    IF EXISTS (
        SELECT 1 FROM dbo.Review
        WHERE TID_UserId = @UserId AND TID_ProductId = @ProductId
    )
    BEGIN
        SET @ResultCode = 3;
        RETURN;
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.OrderItem OI
        INNER JOIN dbo.Order O ON O.TID_Id = OI.TID_OrderId
        WHERE O.TID_Id = @OrderId
          AND O.TID_UserId = @UserId
          AND OI.TID_ProductId = @ProductId
          AND O.TC_Status IN ('PAID', 'SHIPPED', 'DELIVERED')
    )
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    SET @NewId = NEWID();

    INSERT INTO dbo.Review
    (
        TID_Id,
        TID_UserId,
        TID_ProductId,
        TID_OrderId,
        TN_Rating,
        TC_Comment
    )
    VALUES
    (
        @NewId,
        @UserId,
        @ProductId,
        @OrderId,
        @Rating,
        @Comment
    );

    SET @ResultCode = 0;
END;
GO
