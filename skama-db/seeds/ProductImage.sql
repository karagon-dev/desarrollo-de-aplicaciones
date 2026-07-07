-- URLs de referencia para imágenes (subir archivos reales vía admin o API si se desea vista previa)

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456001')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456001',
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
        '/images/products/seed-anillo-clasico.webp',
        'Anillo Esmeralda Clásico',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456002')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456002',
        'c3d4e5f6-a7b8-9012-cdef-123456789013',
        '/images/products/seed-collar-premium.webp',
        'Collar Esmeralda Premium',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456003')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456003',
        'c3d4e5f6-a7b8-9012-cdef-123456789014',
        '/images/products/seed-aretes-drop.webp',
        'Aretes Esmeralda Drop',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456004')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456004',
        'c3d4e5f6-a7b8-9012-cdef-123456789015',
        '/images/products/seed-pulsera-delicada.webp',
        'Pulsera Esmeralda Delicada',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456005')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456005',
        'c3d4e5f6-a7b8-9012-cdef-123456789016',
        '/images/products/seed-anillo-solitario.webp',
        'Anillo Solitario Esmeralda',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456006')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456006',
        'c3d4e5f6-a7b8-9012-cdef-123456789017',
        '/images/products/seed-collar-vintage.webp',
        'Collar Vintage Esmeralda',
        1, 0
    );
END
