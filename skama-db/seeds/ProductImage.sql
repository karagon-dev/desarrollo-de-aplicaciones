-- Reference image URLs (upload real files through admin or API if preview is needed)

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456001')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456001',
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
        '/images/products/seed-classic-ring.webp',
        'Classic Emerald Ring',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456002')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456002',
        'c3d4e5f6-a7b8-9012-cdef-123456789013',
        '/images/products/seed-premium-necklace.webp',
        'Premium Emerald Necklace',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456003')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456003',
        'c3d4e5f6-a7b8-9012-cdef-123456789014',
        '/images/products/seed-drop-earrings.webp',
        'Emerald Drop Earrings',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456004')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456004',
        'c3d4e5f6-a7b8-9012-cdef-123456789015',
        '/images/products/seed-delicate-bracelet.webp',
        'Delicate Emerald Bracelet',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456005')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456005',
        'c3d4e5f6-a7b8-9012-cdef-123456789016',
        '/images/products/seed-solitaire-ring.webp',
        'Emerald Solitaire Ring',
        1, 0
    );
END

IF NOT EXISTS (SELECT 1 FROM ProductImage WHERE TID_Id = 'd0e1f2a3-b4c5-6789-3456-890123456006')
BEGIN
    INSERT INTO ProductImage (TID_Id, TID_ProductId, TC_ImageUrl, TC_AltText, TB_IsMain, TN_SortOrder)
    VALUES (
        'd0e1f2a3-b4c5-6789-3456-890123456006',
        'c3d4e5f6-a7b8-9012-cdef-123456789017',
        '/images/products/seed-vintage-necklace.webp',
        'Vintage Emerald Necklace',
        1, 0
    );
END
