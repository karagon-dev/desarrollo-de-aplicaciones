CREATE PROCEDURE dbo.usp_Promotion_Update
    @Id UNIQUEIDENTIFIER,
    @Name NVARCHAR(150),
    @Description NVARCHAR(500) = NULL,
    @DiscountPercentage DECIMAL(5,2),
    @StartDate DATE,
    @EndDate DATE,
    @IsActive BIT,
    @RowsAffected INT OUTPUT,
    @ResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF @DiscountPercentage <= 0 OR @DiscountPercentage > 100 OR @EndDate < @StartDate
    BEGIN
        SET @ResultCode = 2;
        RETURN;
    END;

    UPDATE dbo.Promotion
    SET
        TC_Name = @Name,
        TC_Description = @Description,
        TN_DiscountPercentage = @DiscountPercentage,
        TD_StartDate = @StartDate,
        TD_EndDate = @EndDate,
        TB_IsActive = @IsActive,
        TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;

    IF @RowsAffected = 0
    BEGIN
        SET @ResultCode = 1;
        RETURN;
    END;

    SET @ResultCode = 0;
END;
GO
