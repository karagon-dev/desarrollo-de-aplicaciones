MERGE ProductImage AS Target
USING (VALUES
    ('d0e1f2a3-b4c5-6789-3456-890123456001', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'limited-cultural-bracelet.jpeg', N'Brazalete Raíces Doradas de edición limitada', 1, 0),
    ('d0e1f2a3-b4c5-6789-3456-890123456002', 'c3d4e5f6-a7b8-9012-cdef-123456789013', 'limited-costa-rican-necklace.jpeg', N'Collar Corazón de mi Tierra de edición limitada', 1, 0),
    ('d0e1f2a3-b4c5-6789-3456-890123456003', 'c3d4e5f6-a7b8-9012-cdef-123456789014', 'limited-flower-hairpin.jpeg', N'Horquilla Aurora Morada de edición limitada', 1, 0),
    ('d0e1f2a3-b4c5-6789-3456-890123456004', 'c3d4e5f6-a7b8-9012-cdef-123456789015', 'limited-fauna-watch.jpeg', N'Reloj Legado del Mar de edición limitada', 1, 0),

    ('d0e1f2a3-b4c5-6789-3456-890123456005', 'c3d4e5f6-a7b8-9012-cdef-123456789016', 'coffee-ring-green-silver.jpeg', N'Anillo Café de mi Tierra en plata verde', 1, 0),
    ('d0e1f2a3-b4c5-6789-3456-890123456006', 'c3d4e5f6-a7b8-9012-cdef-123456789017', 'land-fruit-hairpin-green-silver.jpeg', N'Horquilla Fruto de la Tierra en plata verde', 1, 0),
    ('d0e1f2a3-b4c5-6789-3456-890123456007', 'c3d4e5f6-a7b8-9012-cdef-123456789018', 'eternal-bond-bracelet-green-silver.jpeg', N'Pulsera Vínculo Eterno en plata verde', 1, 0),
    ('d0e1f2a3-b4c5-6789-3456-890123456008', 'c3d4e5f6-a7b8-9012-cdef-123456789019', 'forest-spirit-watch-green-silver.jpeg', N'Reloj Espíritu del Bosque en plata verde', 1, 0),

    ('d0e1f2a3-b4c5-6789-3456-890123456009', 'c3d4e5f6-a7b8-9012-cdef-123456789020', 'coffee-ring-silver.jpeg', N'Anillo Café de mi Tierra en plata', 1, 0),
    ('d0e1f2a3-b4c5-6789-3456-890123456010', 'c3d4e5f6-a7b8-9012-cdef-123456789021', 'land-fruit-hairpin-silver.jpeg', N'Horquilla Fruto de la Tierra en plata', 1, 0),
    ('d0e1f2a3-b4c5-6789-3456-890123456011', 'c3d4e5f6-a7b8-9012-cdef-123456789022', 'eternal-bond-bracelet-silver.jpeg', N'Pulsera Vínculo Eterno en plata', 1, 0),
    ('d0e1f2a3-b4c5-6789-3456-890123456012', 'c3d4e5f6-a7b8-9012-cdef-123456789023', 'forest-spirit-watch-silver.jpeg', N'Reloj Espíritu del Bosque en plata', 1, 0),

    ('d0e1f2a3-b4c5-6789-3456-890123456013', 'c3d4e5f6-a7b8-9012-cdef-123456789024', 'coffee-ring-gold.jpeg', N'Anillo Café de mi Tierra en oro', 1, 0),
    ('d0e1f2a3-b4c5-6789-3456-890123456014', 'c3d4e5f6-a7b8-9012-cdef-123456789025', 'land-fruit-hairpin-gold.jpeg', N'Horquilla Fruto de la Tierra en oro', 1, 0),
    ('d0e1f2a3-b4c5-6789-3456-890123456015', 'c3d4e5f6-a7b8-9012-cdef-123456789026', 'eternal-bond-bracelet-gold.jpeg', N'Pulsera Vínculo Eterno en oro', 1, 0),
    ('d0e1f2a3-b4c5-6789-3456-890123456016', 'c3d4e5f6-a7b8-9012-cdef-123456789027', 'forest-spirit-watch-gold.jpeg', N'Reloj Espíritu del Bosque en oro', 1, 0)
) AS Source (
    Id,
    ProductId,
    ImageUrl,
    AltText,
    IsMain,
    SortOrder
)
ON Target.TID_Id = Source.Id
WHEN MATCHED THEN
    UPDATE SET
        TID_ProductId = Source.ProductId,
        TC_ImageUrl = Source.ImageUrl,
        TC_AltText = Source.AltText,
        TB_IsMain = Source.IsMain,
        TN_SortOrder = Source.SortOrder
WHEN NOT MATCHED THEN
    INSERT (
        TID_Id,
        TID_ProductId,
        TC_ImageUrl,
        TC_AltText,
        TB_IsMain,
        TN_SortOrder
    )
    VALUES (
        Source.Id,
        Source.ProductId,
        Source.ImageUrl,
        Source.AltText,
        Source.IsMain,
        Source.SortOrder
    );

