-- Historial de inventario (auditoría; no modifica TN_StockQuantity en Product)

IF NOT EXISTS (SELECT 1 FROM InventoryMovement WHERE TID_Id = 'f6a7b8c9-d0e1-2345-f012-456789012345')
BEGIN
    INSERT INTO InventoryMovement (
        TID_Id, TID_ProductId, TC_MovementType, TN_Quantity,
        TN_PreviousStock, TN_NewStock, TID_ReferenceOrderId, TD_CreatedAt
    )
    VALUES (
        'f6a7b8c9-d0e1-2345-f012-456789012345',
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
        'MANUAL_ADJUSTMENT', 10, 0, 10, NULL,
        '2026-01-02T08:00:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM InventoryMovement WHERE TID_Id = 'f6a7b8c9-d0e1-2345-f012-456789012346')
BEGIN
    INSERT INTO InventoryMovement (
        TID_Id, TID_ProductId, TC_MovementType, TN_Quantity,
        TN_PreviousStock, TN_NewStock, TID_ReferenceOrderId, TD_CreatedAt
    )
    VALUES (
        'f6a7b8c9-d0e1-2345-f012-456789012346',
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
        'SALE', 1, 10, 9,
        'b8c9d0e1-f2a3-4567-1234-678901234567',
        '2026-02-15T10:30:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM InventoryMovement WHERE TID_Id = 'f6a7b8c9-d0e1-2345-f012-456789012347')
BEGIN
    INSERT INTO InventoryMovement (
        TID_Id, TID_ProductId, TC_MovementType, TN_Quantity,
        TN_PreviousStock, TN_NewStock, TID_ReferenceOrderId, TD_CreatedAt
    )
    VALUES (
        'f6a7b8c9-d0e1-2345-f012-456789012347',
        'c3d4e5f6-a7b8-9012-cdef-123456789013',
        'MANUAL_ADJUSTMENT', 5, 0, 5, NULL,
        '2026-01-02T08:05:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM InventoryMovement WHERE TID_Id = 'f6a7b8c9-d0e1-2345-f012-456789012348')
BEGIN
    INSERT INTO InventoryMovement (
        TID_Id, TID_ProductId, TC_MovementType, TN_Quantity,
        TN_PreviousStock, TN_NewStock, TID_ReferenceOrderId, TD_CreatedAt
    )
    VALUES (
        'f6a7b8c9-d0e1-2345-f012-456789012348',
        'c3d4e5f6-a7b8-9012-cdef-123456789013',
        'SALE', 1, 5, 4,
        'b8c9d0e1-f2a3-4567-1234-678901234568',
        '2026-03-01T14:15:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM InventoryMovement WHERE TID_Id = 'f6a7b8c9-d0e1-2345-f012-456789012349')
BEGIN
    INSERT INTO InventoryMovement (
        TID_Id, TID_ProductId, TC_MovementType, TN_Quantity,
        TN_PreviousStock, TN_NewStock, TID_ReferenceOrderId, TD_CreatedAt
    )
    VALUES (
        'f6a7b8c9-d0e1-2345-f012-456789012349',
        'c3d4e5f6-a7b8-9012-cdef-123456789016',
        'MANUAL_ADJUSTMENT', 3, 0, 3, NULL,
        '2026-01-02T08:10:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM InventoryMovement WHERE TID_Id = 'f6a7b8c9-d0e1-2345-f012-45678901234a')
BEGIN
    INSERT INTO InventoryMovement (
        TID_Id, TID_ProductId, TC_MovementType, TN_Quantity,
        TN_PreviousStock, TN_NewStock, TID_ReferenceOrderId, TD_CreatedAt
    )
    VALUES (
        'f6a7b8c9-d0e1-2345-f012-45678901234a',
        'c3d4e5f6-a7b8-9012-cdef-123456789016',
        'RETURN', 1, 1, 2,
        'b8c9d0e1-f2a3-4567-1234-67890123456a',
        '2026-03-21T09:00:00'
    );
END
