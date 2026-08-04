-- URLs de imágenes de referencia (subir archivos reales desde admin o API si se necesita vista previa)

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456001')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456001',
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
        'anillo-aurora-esmeralda.jpeg',
        'Anillo Aurora Esmeralda',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456002')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456002',
        'c3d4e5f6-a7b8-9012-cdef-123456789013',
        'collar-selva-dorada.jpeg',
        'Collar Selva Dorada',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456003')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456003',
        'c3d4e5f6-a7b8-9012-cdef-123456789014',
        'aretes-luz-jade.png',
        'Aretes Luz de Jade',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456004')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456004',
        'c3d4e5f6-a7b8-9012-cdef-123456789015',
        'pulsera-vinculo-eterno.jpeg',
        'Pulsera Vínculo Eterno',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456005')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456005',
        'c3d4e5f6-a7b8-9012-cdef-123456789016',
        'anillo-bruma-real.jpeg',
        'Anillo Bruma Real',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456006')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456006',
        'c3d4e5f6-a7b8-9012-cdef-123456789017',
        'collar-corazon-mi-tierra.jpeg',
        'Collar Corazón de mi Tierra',
        1, 0
    );
END
