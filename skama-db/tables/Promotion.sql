CREATE TABLE Promotion (
    TID_Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TC_Name NVARCHAR(150) NOT NULL,
    TC_Description NVARCHAR(500) NULL,
    TN_DiscountPercentage DECIMAL(5,2) NOT NULL,
    TD_StartDate DATE NOT NULL,
    TD_EndDate DATE NOT NULL,
    TB_IsActive BIT NOT NULL DEFAULT 1,
    TD_CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    TD_UpdatedAt DATETIME2 NULL,

    CONSTRAINT CK_Promotions_Discount CHECK (TN_DiscountPercentage > 0 AND TN_DiscountPercentage <= 100),
    CONSTRAINT CK_Promotions_Dates CHECK (TD_EndDate >= TD_StartDate)
);
