CREATE TABLE OrderItem (
    TID_Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TID_OrderId UNIQUEIDENTIFIER NOT NULL,
    TID_ProductId UNIQUEIDENTIFIER NOT NULL,
    TC_ProductName NVARCHAR(150) NOT NULL,
    TN_Quantity INT NOT NULL,
    TN_UnitPrice DECIMAL(10,2) NOT NULL,
    TN_DiscountAmount DECIMAL(10,2) NOT NULL DEFAULT 0,
    TN_LineTotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (TID_OrderId) REFERENCES [Order](TID_Id),
    CONSTRAINT FK_OrderItems_Products FOREIGN KEY (TID_ProductId) REFERENCES [Product](TID_Id),
    CONSTRAINT CK_OrderItems_Quantity CHECK (TN_Quantity > 0),
    CONSTRAINT CK_OrderItems_Amounts CHECK (TN_UnitPrice >= 0 AND TN_DiscountAmount >= 0 AND TN_LineTotal >= 0)
);