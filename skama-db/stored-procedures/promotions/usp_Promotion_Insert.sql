CREATE PROCEDURE dbo.usp_Promotion_Insert
    @Name NVARCHAR(150),
    @Description NVARCHAR(500) = NULL,
    @DiscountPercentage DECIMAL(5,2),
    @StartDate DATE,
    @EndDate DATE,
    @NewId UNIQUEIDENTIFIER OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF @DiscountPercentage <= 0 OR @DiscountPercentage > 100 OR @EndDate < @StartDate
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    SET @NewId = NEWID();

    INSERT INTO dbo.Promotion
    (
        TID_Id,
        TC_Name,
        TC_Description,
        TN_DiscountPercentage,
        TD_StartDate,
        TD_EndDate,
        TB_IsActive
    )
    VALUES
    (
        @NewId,
        @Name,
        @Description,
        @DiscountPercentage,
        @StartDate,
        @EndDate,
        1
    );

    SET @ResultCode = 0;
END;
GO
