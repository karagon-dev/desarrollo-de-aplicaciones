DECLARE @SilverCategoryId UNIQUEIDENTIFIER = 'd4e5f6a7-b8c9-0123-def0-234567890123';
DECLARE @GreenSilverCategoryId UNIQUEIDENTIFIER = 'd4e5f6a7-b8c9-0123-def0-234567890124';
DECLARE @GoldCategoryId UNIQUEIDENTIFIER = 'd4e5f6a7-b8c9-0123-def0-234567890125';

MERGE Product AS Target
USING (VALUES
    ('c3d4e5f6-a7b8-9012-cdef-123456789012', @GoldCategoryId, N'Brazalete Raíces Doradas', N'Un homenaje a la tradición y la naturaleza costarricense.', 560000.00, 2, 2, 1, 1),
    ('c3d4e5f6-a7b8-9012-cdef-123456789013', @GoldCategoryId, N'Collar Corazón de mi Tierra', N'La belleza y tradición de nuestra tierra en una joya única.', 510000.00, 2, 2, 1, 1),
    ('c3d4e5f6-a7b8-9012-cdef-123456789014', @GreenSilverCategoryId, N'Horquilla Aurora Morada', N'Inspirada en la majestuosidad de la guaria morada, símbolo de la belleza nacional.', 390000.00, 2, 2, 1, 1),
    ('c3d4e5f6-a7b8-9012-cdef-123456789015', @SilverCategoryId, N'Reloj Legado del Mar', N'La belleza del océano nacional convertida en arte.', 425000.00, 2, 2, 1, 1),

    ('c3d4e5f6-a7b8-9012-cdef-123456789016', @GreenSilverCategoryId, N'Anillo Café de mi Tierra', N'La tradición cafetalera de nuestras amadas tierras.', 98000.00, 6, 2, 0, 1),
    ('c3d4e5f6-a7b8-9012-cdef-123456789017', @GreenSilverCategoryId, N'Horquilla Fruto de la Tierra', N'Donde la naturaleza y la tradición florecen.', 87000.00, 4, 2, 0, 1),
    ('c3d4e5f6-a7b8-9012-cdef-123456789018', @GreenSilverCategoryId, N'Pulsera Vínculo Eterno', N'Un diseño que simboliza la unión, la fortaleza y la elegancia.', 104000.00, 7, 2, 0, 1),
    ('c3d4e5f6-a7b8-9012-cdef-123456789019', @GreenSilverCategoryId, N'Reloj Espíritu del Bosque', N'La elegancia de la riqueza natural y la biodiversidad de nuestra tierra.', 118000.00, 3, 2, 0, 1),

    ('c3d4e5f6-a7b8-9012-cdef-123456789020', @SilverCategoryId, N'Anillo Café de mi Tierra', N'La tradición cafetalera de nuestras amadas tierras.', 92000.00, 8, 2, 0, 1),
    ('c3d4e5f6-a7b8-9012-cdef-123456789021', @SilverCategoryId, N'Horquilla Fruto de la Tierra', N'Donde la naturaleza y la tradición florecen.', 76000.00, 5, 2, 0, 1),
    ('c3d4e5f6-a7b8-9012-cdef-123456789022', @SilverCategoryId, N'Pulsera Vínculo Eterno', N'Un diseño que simboliza la unión, la fortaleza y la elegancia.', 93000.00, 6, 2, 0, 1),
    ('c3d4e5f6-a7b8-9012-cdef-123456789023', @SilverCategoryId, N'Reloj Espíritu del Bosque', N'La elegancia de la riqueza natural y la biodiversidad de nuestra tierra.', 81750.00, 4, 2, 0, 1),

    ('c3d4e5f6-a7b8-9012-cdef-123456789024', @GoldCategoryId, N'Anillo Café de mi Tierra', N'La tradición cafetalera de nuestras amadas tierras.', 156000.00, 5, 2, 0, 1),
    ('c3d4e5f6-a7b8-9012-cdef-123456789025', @GoldCategoryId, N'Horquilla Fruto de la Tierra', N'Donde la naturaleza y la tradición florecen.', 142000.00, 3, 2, 0, 1),
    ('c3d4e5f6-a7b8-9012-cdef-123456789026', @GoldCategoryId, N'Pulsera Vínculo Eterno', N'Un diseño que simboliza la unión, la fortaleza y la elegancia.', 174000.00, 8, 2, 0, 1),
    ('c3d4e5f6-a7b8-9012-cdef-123456789027', @GoldCategoryId, N'Reloj Espíritu del Bosque', N'La elegancia de la riqueza natural y la biodiversidad de nuestra tierra.', 188000.00, 4, 2, 0, 1)
) AS Source (
    Id,
    CategoryId,
    Name,
    Description,
    Price,
    StockQuantity,
    MinimumStock,
    IsLimitedEdition,
    IsActive
)
ON Target.TID_Id = Source.Id
WHEN MATCHED THEN
    UPDATE SET
        TID_CategoryId = Source.CategoryId,
        TC_Name = Source.Name,
        TC_Description = Source.Description,
        TN_Price = Source.Price,
        TN_StockQuantity = Source.StockQuantity,
        TN_MinimumStock = Source.MinimumStock,
        TB_IsLimitedEdition = Source.IsLimitedEdition,
        TB_IsActive = Source.IsActive,
        TD_UpdatedAt = SYSDATETIME()
WHEN NOT MATCHED THEN
    INSERT (
        TID_Id,
        TID_CategoryId,
        TC_Name,
        TC_Description,
        TN_Price,
        TN_StockQuantity,
        TN_MinimumStock,
        TB_IsLimitedEdition,
        TB_IsActive
    )
    VALUES (
        Source.Id,
        Source.CategoryId,
        Source.Name,
        Source.Description,
        Source.Price,
        Source.StockQuantity,
        Source.MinimumStock,
        Source.IsLimitedEdition,
        Source.IsActive
    );

