-- Carritos activos de desarrollo

IF NOT EXISTS (SELECT 1 FROM Cart WHERE TID_Id = 'a1b2c3d4-e5f6-7890-abcd-ef12345678901')
BEGIN
    INSERT INTO Cart (TID_Id, TID_UserId, TC_Status, TD_CreatedAt, TD_UpdatedAt)
    VALUES (
        'a1b2c3d4-e5f6-7890-abcd-ef12345678901',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'ACTIVE',
        '2026-06-01T08:00:00',
        '2026-06-05T10:00:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM CartItem WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456789')
BEGIN
    INSERT INTO CartItem (TID_Id, TID_CartId, TID_ProductId, TN_Quantity, TN_UnitPrice)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456789',
        'a1b2c3d4-e5f6-7890-abcd-ef12345678901',
        'c3d4e5f6-a7b8-9012-cdef-123456789016',
        1,
        3200000.00
    );
END

IF NOT EXISTS (SELECT 1 FROM Cart WHERE TID_Id = 'a1b2c3d4-e5f6-7890-abcd-ef12345678902')
BEGIN
    INSERT INTO Cart (TID_Id, TID_UserId, TC_Status, TD_CreatedAt, TD_UpdatedAt)
    VALUES (
        'a1b2c3d4-e5f6-7890-abcd-ef12345678902',
        '22222222-2222-2222-2222-222222222222',
        'ACTIVE',
        '2026-06-02T09:30:00',
        '2026-06-02T09:30:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM CartItem WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-89012345678a')
BEGIN
    INSERT INTO CartItem (TID_Id, TID_CartId, TID_ProductId, TN_Quantity, TN_UnitPrice)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-89012345678a',
        'a1b2c3d4-e5f6-7890-abcd-ef12345678902',
        'c3d4e5f6-a7b8-9012-cdef-123456789014',
        2,
        890000.00
    );
END
