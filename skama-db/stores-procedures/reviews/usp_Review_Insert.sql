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
        SELECT 1 FROM dbo.Reviews
        WHERE UserId = @UserId AND ProductId = @ProductId
    )
    BEGIN
        SET @ResultCode = 3;
        RETURN;
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.OrderItems OI
        INNER JOIN dbo.Orders O ON O.Id = OI.OrderId
        WHERE O.Id = @OrderId
          AND O.UserId = @UserId
          AND OI.ProductId = @ProductId
          AND O.Status IN ('PAID', 'SHIPPED', 'DELIVERED')
    )
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    SET @NewId = NEWID();

    INSERT INTO dbo.Reviews
    (
        Id,
        UserId,
        ProductId,
        OrderId,
        Rating,
        Comment
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