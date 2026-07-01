CREATE TABLE PromotionProduct (
    TID_Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TID_PromotionId UNIQUEIDENTIFIER NOT NULL,
    TID_ProductId UNIQUEIDENTIFIER NOT NULL,

    CONSTRAINT FK_PromotionProducts_Promotions FOREIGN KEY (TID_PromotionId) REFERENCES Promotion(TID_Id),
    CONSTRAINT FK_PromotionProducts_Products FOREIGN KEY (TID_ProductId) REFERENCES Product(TID_Id),
    CONSTRAINT UQ_PromotionProducts UNIQUE (TID_PromotionId, TID_ProductId)
);
