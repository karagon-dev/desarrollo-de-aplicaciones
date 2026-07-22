-- Product-to-promotion assignments

IF NOT EXISTS (
    SELECT 1 FROM PromotionProduct
    WHERE TID_PromotionId = 'e1f2a3b4-c5d6-7890-4567-901234567890'
      AND TID_ProductId = 'c3d4e5f6-a7b8-9012-cdef-123456789012'
)
BEGIN
    INSERT INTO PromotionProduct (TID_Id, TID_PromotionId, TID_ProductId)
    VALUES ('f1a2b3c4-d5e6-7890-abcd-111111111111', 'e1f2a3b4-c5d6-7890-4567-901234567890', 'c3d4e5f6-a7b8-9012-cdef-123456789012');
END

IF NOT EXISTS (
    SELECT 1 FROM PromotionProduct
    WHERE TID_PromotionId = 'e1f2a3b4-c5d6-7890-4567-901234567890'
      AND TID_ProductId = 'c3d4e5f6-a7b8-9012-cdef-123456789016'
)
BEGIN
    INSERT INTO PromotionProduct (TID_Id, TID_PromotionId, TID_ProductId)
    VALUES ('f1a2b3c4-d5e6-7890-abcd-111111111112', 'e1f2a3b4-c5d6-7890-4567-901234567890', 'c3d4e5f6-a7b8-9012-cdef-123456789016');
END

IF NOT EXISTS (
    SELECT 1 FROM PromotionProduct
    WHERE TID_PromotionId = 'e1f2a3b4-c5d6-7890-4567-901234567890'
      AND TID_ProductId = 'c3d4e5f6-a7b8-9012-cdef-123456789013'
)
BEGIN
    INSERT INTO PromotionProduct (TID_Id, TID_PromotionId, TID_ProductId)
    VALUES ('f1a2b3c4-d5e6-7890-abcd-111111111113', 'e1f2a3b4-c5d6-7890-4567-901234567890', 'c3d4e5f6-a7b8-9012-cdef-123456789013');
END

IF NOT EXISTS (
    SELECT 1 FROM PromotionProduct
    WHERE TID_PromotionId = 'e1f2a3b4-c5d6-7890-4567-901234567890'
      AND TID_ProductId = 'c3d4e5f6-a7b8-9012-cdef-123456789017'
)
BEGIN
    INSERT INTO PromotionProduct (TID_Id, TID_PromotionId, TID_ProductId)
    VALUES ('f1a2b3c4-d5e6-7890-abcd-111111111114', 'e1f2a3b4-c5d6-7890-4567-901234567890', 'c3d4e5f6-a7b8-9012-cdef-123456789017');
END

IF NOT EXISTS (
    SELECT 1 FROM PromotionProduct
    WHERE TID_PromotionId = 'e1f2a3b4-c5d6-7890-4567-901234567891'
      AND TID_ProductId = 'c3d4e5f6-a7b8-9012-cdef-123456789015'
)
BEGIN
    INSERT INTO PromotionProduct (TID_Id, TID_PromotionId, TID_ProductId)
    VALUES ('f1a2b3c4-d5e6-7890-abcd-111111111115', 'e1f2a3b4-c5d6-7890-4567-901234567891', 'c3d4e5f6-a7b8-9012-cdef-123456789015');
END
