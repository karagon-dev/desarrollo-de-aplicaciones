CREATE TABLE InventoryMovements (
    TID_Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TID_ProductId UNIQUEIDENTIFIER NOT NULL,
    TC_MovementType NVARCHAR(30) NOT NULL,
    TN_Quantity INT NOT NULL,
    TN_PreviousStock INT NOT NULL,
    TN_NewStock INT NOT NULL,
    TID_ReferenceOrderId UNIQUEIDENTIFIER NULL,
    TD_CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_InventoryMovements_Products FOREIGN KEY (TID_ProductId) REFERENCES Products(TID_Id),
    CONSTRAINT FK_InventoryMovements_Orders FOREIGN KEY (TID_ReferenceOrderId) REFERENCES Orders(TID_Id),
    CONSTRAINT CK_InventoryMovements_Type CHECK (TC_MovementType IN ('SALE', 'RETURN', 'MANUAL_ADJUSTMENT')),
    CONSTRAINT CK_InventoryMovements_Stock CHECK (TN_PreviousStock >= 0 AND TN_NewStock >= 0),
    CONSTRAINT CK_InventoryMovements_Quantity CHECK (TN_Quantity > 0)
);
