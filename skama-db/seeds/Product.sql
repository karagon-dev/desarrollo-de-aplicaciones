IF NOT EXISTS (SELECT 1 FROM Product WHERE TC_Name = 'Classic Emerald Ring')
BEGIN
    INSERT INTO Product (
        TID_Id,
        TID_CategoryId,
        TC_Name,
        TC_Description,
        TN_Price,
        TN_StockQuantity,
        TN_MinimumStock,
        TB_IsActive
    )
    VALUES (
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
        'd4e5f6a7-b8c9-0123-def0-234567890123',
        'Classic Emerald Ring',
        '18k gold ring with a brilliant-cut Colombian emerald. Includes an authenticity certificate.',
        1250000.00,
        10,
        3,
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Product WHERE TC_Name = 'Premium Emerald Necklace')
BEGIN
    INSERT INTO Product (
        TID_Id,
        TID_CategoryId,
        TC_Name,
        TC_Description,
        TN_Price,
        TN_StockQuantity,
        TN_MinimumStock,
        TB_IsActive
    )
    VALUES (
        'c3d4e5f6-a7b8-9012-cdef-123456789013',
        'd4e5f6a7-b8c9-0123-def0-234567890124',
        'Premium Emerald Necklace',
        'White gold necklace with a central emerald and elegant design for special occasions.',
        2100000.00,
        2,
        5,
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Product WHERE TC_Name = 'Emerald Drop Earrings')
BEGIN
    INSERT INTO Product (
        TID_Id,
        TID_CategoryId,
        TC_Name,
        TC_Description,
        TN_Price,
        TN_StockQuantity,
        TN_MinimumStock,
        TB_IsActive
    )
    VALUES (
        'c3d4e5f6-a7b8-9012-cdef-123456789014',
        'd4e5f6a7-b8c9-0123-def0-234567890125',
        'Emerald Drop Earrings',
        'Drop earrings with Colombian emeralds and a yellow gold finish.',
        890000.00,
        8,
        2,
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Product WHERE TC_Name = 'Delicate Emerald Bracelet')
BEGIN
    INSERT INTO Product (
        TID_Id,
        TID_CategoryId,
        TC_Name,
        TC_Description,
        TN_Price,
        TN_StockQuantity,
        TN_MinimumStock,
        TB_IsActive
    )
    VALUES (
        'c3d4e5f6-a7b8-9012-cdef-123456789015',
        'd4e5f6a7-b8c9-0123-def0-234567890126',
        'Delicate Emerald Bracelet',
        'Fine bracelet with set emeralds and a gold safety clasp.',
        750000.00,
        12,
        4,
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Product WHERE TC_Name = 'Emerald Solitaire Ring')
BEGIN
    INSERT INTO Product (
        TID_Id,
        TID_CategoryId,
        TC_Name,
        TC_Description,
        TN_Price,
        TN_StockQuantity,
        TN_MinimumStock,
        TB_IsActive
    )
    VALUES (
        'c3d4e5f6-a7b8-9012-cdef-123456789016',
        'd4e5f6a7-b8c9-0123-def0-234567890123',
        'Emerald Solitaire Ring',
        'Solitaire ring with a high-purity emerald and platinum setting.',
        3200000.00,
        1,
        2,
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Product WHERE TC_Name = 'Vintage Emerald Necklace')
BEGIN
    INSERT INTO Product (
        TID_Id,
        TID_CategoryId,
        TC_Name,
        TC_Description,
        TN_Price,
        TN_StockQuantity,
        TN_MinimumStock,
        TB_IsActive
    )
    VALUES (
        'c3d4e5f6-a7b8-9012-cdef-123456789017',
        'd4e5f6a7-b8c9-0123-def0-234567890124',
        'Vintage Emerald Necklace',
        'Vintage design inspired by classic Colombian jewelry with a central emerald.',
        1850000.00,
        6,
        2,
        1
    );
END
