-- Development orders and items
-- Primary user: customer@example.com (3fa85f64-5717-4562-b3fc-2c963f66afa6)
-- Secondary user: maria.garcia@skama.com (22222222-2222-2222-2222-222222222222)

IF NOT EXISTS (SELECT 1 FROM [Order] WHERE TC_OrderNumber = 'ORD-20260215-001')
BEGIN
    INSERT INTO [Order] (
        TID_Id,
        TID_UserId,
        TC_OrderNumber,
        TC_Status,
        TC_PaymentMethod,
        TC_ShippingAddress,
        TN_Subtotal,
        TN_DiscountTotal,
        TN_Total,
        TD_CreatedAt
    )
    VALUES (
        'b8c9d0e1-f2a3-4567-1234-678901234567',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'ORD-20260215-001',
        'DELIVERED',
        'CREDIT_CARD',
        '85th Street #12-34, Chapinero, Bogota',
        1250000.00,
        187500.00,
        1062500.00,
        '2026-02-15T10:30:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM OrderItem WHERE TID_Id = 'c9d0e1f2-a3b4-5678-2345-789012345678')
BEGIN
    INSERT INTO OrderItem (
        TID_Id,
        TID_OrderId,
        TID_ProductId,
        TC_ProductName,
        TN_Quantity,
        TN_UnitPrice,
        TN_DiscountAmount,
        TN_LineTotal
    )
    VALUES (
        'c9d0e1f2-a3b4-5678-2345-789012345678',
        'b8c9d0e1-f2a3-4567-1234-678901234567',
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
        'Classic Emerald Ring',
        1,
        1250000.00,
        187500.00,
        1062500.00
    );
END

IF NOT EXISTS (SELECT 1 FROM [Order] WHERE TC_OrderNumber = 'ORD-20260301-001')
BEGIN
    INSERT INTO [Order] (
        TID_Id,
        TID_UserId,
        TC_OrderNumber,
        TC_Status,
        TC_PaymentMethod,
        TC_ShippingAddress,
        TN_Subtotal,
        TN_DiscountTotal,
        TN_Total,
        TD_CreatedAt
    )
    VALUES (
        'b8c9d0e1-f2a3-4567-1234-678901234568',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'ORD-20260301-001',
        'SHIPPED',
        'DEBIT_CARD',
        '85th Street #12-34, Chapinero, Bogota',
        2990000.00,
        0.00,
        2990000.00,
        '2026-03-01T14:15:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM OrderItem WHERE TID_Id = 'c9d0e1f2-a3b4-5678-2345-789012345679')
BEGIN
    INSERT INTO OrderItem (
        TID_Id, TID_OrderId, TID_ProductId, TC_ProductName,
        TN_Quantity, TN_UnitPrice, TN_DiscountAmount, TN_LineTotal
    )
    VALUES (
        'c9d0e1f2-a3b4-5678-2345-789012345679',
        'b8c9d0e1-f2a3-4567-1234-678901234568',
        'c3d4e5f6-a7b8-9012-cdef-123456789013',
        'Premium Emerald Necklace',
        1, 2100000.00, 0.00, 2100000.00
    );
END

IF NOT EXISTS (SELECT 1 FROM OrderItem WHERE TID_Id = 'c9d0e1f2-a3b4-5678-2345-78901234567a')
BEGIN
    INSERT INTO OrderItem (
        TID_Id, TID_OrderId, TID_ProductId, TC_ProductName,
        TN_Quantity, TN_UnitPrice, TN_DiscountAmount, TN_LineTotal
    )
    VALUES (
        'c9d0e1f2-a3b4-5678-2345-78901234567a',
        'b8c9d0e1-f2a3-4567-1234-678901234568',
        'c3d4e5f6-a7b8-9012-cdef-123456789014',
        'Emerald Drop Earrings',
        1, 890000.00, 0.00, 890000.00
    );
END

IF NOT EXISTS (SELECT 1 FROM [Order] WHERE TC_OrderNumber = 'ORD-20260310-001')
BEGIN
    INSERT INTO [Order] (
        TID_Id, TID_UserId, TC_OrderNumber, TC_Status, TC_PaymentMethod,
        TC_ShippingAddress, TN_Subtotal, TN_DiscountTotal, TN_Total, TD_CreatedAt
    )
    VALUES (
        'b8c9d0e1-f2a3-4567-1234-678901234569',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'ORD-20260310-001',
        'PAID',
        'TRANSFER',
        '85th Street #12-34, Chapinero, Bogota',
        750000.00, 0.00, 750000.00,
        '2026-03-10T09:00:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM OrderItem WHERE TID_Id = 'c9d0e1f2-a3b4-5678-2345-78901234567b')
BEGIN
    INSERT INTO OrderItem (
        TID_Id, TID_OrderId, TID_ProductId, TC_ProductName,
        TN_Quantity, TN_UnitPrice, TN_DiscountAmount, TN_LineTotal
    )
    VALUES (
        'c9d0e1f2-a3b4-5678-2345-78901234567b',
        'b8c9d0e1-f2a3-4567-1234-678901234569',
        'c3d4e5f6-a7b8-9012-cdef-123456789015',
        'Delicate Emerald Bracelet',
        1, 750000.00, 0.00, 750000.00
    );
END

IF NOT EXISTS (SELECT 1 FROM [Order] WHERE TC_OrderNumber = 'ORD-20260320-001')
BEGIN
    INSERT INTO [Order] (
        TID_Id, TID_UserId, TC_OrderNumber, TC_Status, TC_PaymentMethod,
        TC_ShippingAddress, TN_Subtotal, TN_DiscountTotal, TN_Total, TD_CreatedAt
    )
    VALUES (
        'b8c9d0e1-f2a3-4567-1234-67890123456a',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'ORD-20260320-001',
        'CANCELLED',
        'CREDIT_CARD',
        '85th Street #12-34, Chapinero, Bogota',
        3200000.00, 0.00, 3200000.00,
        '2026-03-20T16:45:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM OrderItem WHERE TID_Id = 'c9d0e1f2-a3b4-5678-2345-78901234567c')
BEGIN
    INSERT INTO OrderItem (
        TID_Id, TID_OrderId, TID_ProductId, TC_ProductName,
        TN_Quantity, TN_UnitPrice, TN_DiscountAmount, TN_LineTotal
    )
    VALUES (
        'c9d0e1f2-a3b4-5678-2345-78901234567c',
        'b8c9d0e1-f2a3-4567-1234-67890123456a',
        'c3d4e5f6-a7b8-9012-cdef-123456789016',
        'Emerald Solitaire Ring',
        1, 3200000.00, 0.00, 3200000.00
    );
END

IF NOT EXISTS (SELECT 1 FROM [Order] WHERE TC_OrderNumber = 'ORD-20260401-001')
BEGIN
    INSERT INTO [Order] (
        TID_Id, TID_UserId, TC_OrderNumber, TC_Status, TC_PaymentMethod,
        TC_ShippingAddress, TN_Subtotal, TN_DiscountTotal, TN_Total, TD_CreatedAt
    )
    VALUES (
        'b8c9d0e1-f2a3-4567-1234-67890123456b',
        '22222222-2222-2222-2222-222222222222',
        'ORD-20260401-001',
        'DELIVERED',
        'CREDIT_CARD',
        '7th Avenue #45-67, Bogota',
        1850000.00, 0.00, 1850000.00,
        '2026-04-01T11:20:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM OrderItem WHERE TID_Id = 'c9d0e1f2-a3b4-5678-2345-78901234567d')
BEGIN
    INSERT INTO OrderItem (
        TID_Id, TID_OrderId, TID_ProductId, TC_ProductName,
        TN_Quantity, TN_UnitPrice, TN_DiscountAmount, TN_LineTotal
    )
    VALUES (
        'c9d0e1f2-a3b4-5678-2345-78901234567d',
        'b8c9d0e1-f2a3-4567-1234-67890123456b',
        'c3d4e5f6-a7b8-9012-cdef-123456789017',
        'Vintage Emerald Necklace',
        1, 1850000.00, 0.00, 1850000.00
    );
END
