CREATE TABLE PromotionProducts (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PromotionId UNIQUEIDENTIFIER NOT NULL,
    ProductId UNIQUEIDENTIFIER NOT NULL,

    CONSTRAINT FK_PromotionProducts_Promotions FOREIGN KEY (PromotionId) REFERENCES Promotions(Id),
    CONSTRAINT FK_PromotionProducts_Products FOREIGN KEY (ProductId) REFERENCES Products(Id),
    CONSTRAINT UQ_PromotionProducts UNIQUE (PromotionId, ProductId)
);