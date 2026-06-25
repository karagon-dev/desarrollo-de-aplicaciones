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

    UPDATE dbo.Promotions
    SET
        Name = @Name,
        Description = @Description,
        DiscountPercentage = @DiscountPercentage,
        StartDate = @StartDate,
        EndDate = @EndDate,
        IsActive = @IsActive,
        UpdatedAt = SYSDATETIME()
    WHERE Id = @Id;

    SET @RowsAffected = @@ROWCOUNT;

    IF @RowsAffected = 0
    BEGIN
        SET @ResultCode = 1;
        RETURN;
    END;

    SET @ResultCode = 0;
END;
GO