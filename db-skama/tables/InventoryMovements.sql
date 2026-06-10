CREATE TABLE InventoryMovements (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ProductId UNIQUEIDENTIFIER NOT NULL,
    MovementType NVARCHAR(30) NOT NULL,
    Quantity INT NOT NULL,
    PreviousStock INT NOT NULL,
    NewStock INT NOT NULL,
    ReferenceOrderId UNIQUEIDENTIFIER NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_InventoryMovements_Products FOREIGN KEY (ProductId) REFERENCES Products(Id),
    CONSTRAINT FK_InventoryMovements_Orders FOREIGN KEY (ReferenceOrderId) REFERENCES Orders(Id),
    CONSTRAINT CK_InventoryMovements_Type CHECK (MovementType IN ('SALE', 'RETURN', 'MANUAL_ADJUSTMENT')),
    CONSTRAINT CK_InventoryMovements_Stock CHECK (PreviousStock >= 0 AND NewStock >= 0),
    CONSTRAINT CK_InventoryMovements_Quantity CHECK (Quantity > 0)
);