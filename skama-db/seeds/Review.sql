IF NOT EXISTS (SELECT 1 FROM Review WHERE TID_Id = 'f2a3b4c5-d6e7-8901-5678-012345678901')
BEGIN
    INSERT INTO Review (
        TID_Id,
        TID_UserId,
        TID_ProductId,
        TID_OrderId,
        TN_Rating,
        TC_Comment,
        TD_CreatedAt
    )
    VALUES (
        'f2a3b4c5-d6e7-8901-5678-012345678901',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
        'b8c9d0e1-f2a3-4567-1234-678901234567',
        5,
        'Excelente calidad y acabado. La esmeralda luce espectacular.',
        '2026-02-20T15:00:00'
    );
END

IF NOT EXISTS (SELECT 1 FROM Review WHERE TID_Id = 'f2a3b4c5-d6e7-8901-5678-012345678902')
BEGIN
    INSERT INTO Review (
        TID_Id,
        TID_UserId,
        TID_ProductId,
        TID_OrderId,
        TN_Rating,
        TC_Comment,
        TD_CreatedAt
    )
    VALUES (
        'f2a3b4c5-d6e7-8901-5678-012345678902',
        '22222222-2222-2222-2222-222222222222',
        'c3d4e5f6-a7b8-9012-cdef-123456789017',
        'b8c9d0e1-f2a3-4567-1234-67890123456b',
        4,
        'Muy bonito diseño vintage. La entrega fue rápida.',
        '2026-04-05T10:30:00'
    );
END
