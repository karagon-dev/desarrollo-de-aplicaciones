CREATE TABLE Promotions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(150) NOT NULL,
    Description NVARCHAR(500) NULL,
    DiscountPercentage DECIMAL(5,2) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NULL,

    CONSTRAINT CK_Promotions_Discount CHECK (DiscountPercentage > 0 AND DiscountPercentage <= 100),
    CONSTRAINT CK_Promotions_Dates CHECK (EndDate >= StartDate)
);