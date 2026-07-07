IF NOT EXISTS (SELECT 1 FROM Product WHERE TC_Name = 'Anillo Esmeralda Clásico')
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
        'Anillo Esmeralda Clásico',
        'Anillo en oro de 18k con esmeralda colombiana de corte brillante. Incluye certificado de autenticidad.',
        1250000.00,
        10,
        3,
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Product WHERE TC_Name = 'Collar Esmeralda Premium')
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
        'Collar Esmeralda Premium',
        'Collar en oro blanco con esmeralda central y diseño elegante para ocasiones especiales.',
        2100000.00,
        2,
        5,
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Product WHERE TC_Name = 'Aretes Esmeralda Drop')
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
        'Aretes Esmeralda Drop',
        'Aretes tipo drop con esmeralda colombiana y acabado en oro amarillo.',
        890000.00,
        8,
        2,
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Product WHERE TC_Name = 'Pulsera Esmeralda Delicada')
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
        'Pulsera Esmeralda Delicada',
        'Pulsera fina con esmeraldas engastadas y cierre de seguridad en oro.',
        750000.00,
        12,
        4,
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Product WHERE TC_Name = 'Anillo Solitario Esmeralda')
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
        'Anillo Solitario Esmeralda',
        'Anillo solitario con esmeralda de alta pureza y montura en platino.',
        3200000.00,
        1,
        2,
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Product WHERE TC_Name = 'Collar Vintage Esmeralda')
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
        'Collar Vintage Esmeralda',
        'Diseño vintage inspirado en la joyería clásica colombiana con esmeralda central.',
        1850000.00,
        6,
        2,
        1
    );
END
