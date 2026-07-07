IF NOT EXISTS (SELECT 1 FROM Promotion WHERE TC_Name = 'Descuento Primavera')
BEGIN
    INSERT INTO Promotion (
        TID_Id,
        TC_Name,
        TC_Description,
        TN_DiscountPercentage,
        TD_StartDate,
        TD_EndDate,
        TB_IsActive
    )
    VALUES (
        'e1f2a3b4-c5d6-7890-4567-901234567890',
        'Descuento Primavera',
        '15% de descuento en anillos y collares seleccionados',
        15.00,
        '2026-01-01',
        '2026-12-31',
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Promotion WHERE TC_Name = 'Bienvenida SKAMA')
BEGIN
    INSERT INTO Promotion (
        TID_Id,
        TC_Name,
        TC_Description,
        TN_DiscountPercentage,
        TD_StartDate,
        TD_EndDate,
        TB_IsActive
    )
    VALUES (
        'e1f2a3b4-c5d6-7890-4567-901234567891',
        'Bienvenida SKAMA',
        '10% en tu primera compra de joyería con esmeralda',
        10.00,
        '2026-01-01',
        '2026-12-31',
        1
    );
END
