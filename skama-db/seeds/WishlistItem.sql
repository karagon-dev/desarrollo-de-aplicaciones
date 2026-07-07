IF NOT EXISTS (
    SELECT 1 FROM WishlistItem
    WHERE TID_UserId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      AND TID_ProductId = 'c3d4e5f6-a7b8-9012-cdef-123456789016'
)
BEGIN
    INSERT INTO WishlistItem (TID_Id, TID_UserId, TID_ProductId, TD_CreatedAt)
    VALUES (
        'a3b4c5d6-e7f8-9012-6789-123456789012',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'c3d4e5f6-a7b8-9012-cdef-123456789016',
        '2026-05-10T12:00:00'
    );
END

IF NOT EXISTS (
    SELECT 1 FROM WishlistItem
    WHERE TID_UserId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      AND TID_ProductId = 'c3d4e5f6-a7b8-9012-cdef-123456789017'
)
BEGIN
    INSERT INTO WishlistItem (TID_Id, TID_UserId, TID_ProductId, TD_CreatedAt)
    VALUES (
        'a3b4c5d6-e7f8-9012-6789-123456789013',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'c3d4e5f6-a7b8-9012-cdef-123456789017',
        '2026-05-12T18:30:00'
    );
END

IF NOT EXISTS (
    SELECT 1 FROM WishlistItem
    WHERE TID_UserId = '22222222-2222-2222-2222-222222222222'
      AND TID_ProductId = 'c3d4e5f6-a7b8-9012-cdef-123456789012'
)
BEGIN
    INSERT INTO WishlistItem (TID_Id, TID_UserId, TID_ProductId, TD_CreatedAt)
    VALUES (
        'a3b4c5d6-e7f8-9012-6789-123456789014',
        '22222222-2222-2222-2222-222222222222',
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
        '2026-05-20T08:15:00'
    );
END
