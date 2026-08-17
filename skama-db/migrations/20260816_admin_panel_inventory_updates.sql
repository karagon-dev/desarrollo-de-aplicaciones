/*
  SKAMA - Actualizaciones para panel administrativo.

  Ejecutar antes de actualizar stored procedures si la base ya existe.
*/

IF COL_LENGTH('dbo.Product', 'TB_IsLimitedEdition') IS NULL
BEGIN
    ALTER TABLE dbo.Product
    ADD TB_IsLimitedEdition BIT NOT NULL
        CONSTRAINT DF_Product_IsLimitedEdition DEFAULT 0;
END;
GO

DECLARE @SilverCategoryId UNIQUEIDENTIFIER = 'd4e5f6a7-b8c9-0123-def0-234567890123';
DECLARE @GreenSilverCategoryId UNIQUEIDENTIFIER = 'd4e5f6a7-b8c9-0123-def0-234567890124';
DECLARE @GoldCategoryId UNIQUEIDENTIFIER = 'd4e5f6a7-b8c9-0123-def0-234567890125';

UPDATE dbo.Category
SET
    TC_Name = 'Plata',
    TC_Description = 'Joyas elaboradas en plata',
    TB_IsActive = 1,
    TD_UpdatedAt = SYSDATETIME()
WHERE TID_Id = @SilverCategoryId;

UPDATE dbo.Category
SET
    TC_Name = 'Plata verde',
    TC_Description = 'Joyas de plata con acentos verdes',
    TB_IsActive = 1,
    TD_UpdatedAt = SYSDATETIME()
WHERE TID_Id = @GreenSilverCategoryId;

UPDATE dbo.Category
SET
    TC_Name = 'Oro',
    TC_Description = 'Joyas elaboradas en oro',
    TB_IsActive = 1,
    TD_UpdatedAt = SYSDATETIME()
WHERE TID_Id = @GoldCategoryId;

UPDATE dbo.Category
SET
    TB_IsActive = 0,
    TD_UpdatedAt = SYSDATETIME()
WHERE TC_Name IN ('Anillos', 'Collares', 'Aretes', 'Brazaletes');

UPDATE dbo.Product
SET TN_MinimumStock = 2;

UPDATE dbo.Product
SET TID_CategoryId = CASE
    WHEN TC_Name IN ('Anillo Aurora Esmeralda', 'Collar Selva Dorada', 'Aretes Luz de Jade') THEN @GoldCategoryId
    WHEN TC_Name = 'Pulsera Vínculo Eterno' THEN @GreenSilverCategoryId
    WHEN TC_Name IN ('Anillo Bruma Real', 'Collar Corazón de mi Tierra') THEN @SilverCategoryId
    ELSE TID_CategoryId
END
WHERE TC_Name IN (
    'Anillo Aurora Esmeralda',
    'Collar Selva Dorada',
    'Aretes Luz de Jade',
    'Pulsera Vínculo Eterno',
    'Anillo Bruma Real',
    'Collar Corazón de mi Tierra'
);

UPDATE dbo.Product
SET TB_IsLimitedEdition = 1
WHERE TC_Name IN ('Collar Selva Dorada', 'Anillo Bruma Real', 'Collar Corazón de mi Tierra');
GO
