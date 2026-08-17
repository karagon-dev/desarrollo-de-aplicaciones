DECLARE @SilverCategoryId UNIQUEIDENTIFIER = 'd4e5f6a7-b8c9-0123-def0-234567890123';
DECLARE @GreenSilverCategoryId UNIQUEIDENTIFIER = 'd4e5f6a7-b8c9-0123-def0-234567890124';
DECLARE @GoldCategoryId UNIQUEIDENTIFIER = 'd4e5f6a7-b8c9-0123-def0-234567890125';

IF EXISTS (SELECT 1 FROM Category WHERE TID_Id = @SilverCategoryId)
BEGIN
    UPDATE Category
    SET
        TC_Name = 'Plata',
        TC_Description = 'Joyas elaboradas en plata',
        TB_IsActive = 1,
        TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @SilverCategoryId;
END
ELSE IF NOT EXISTS (SELECT 1 FROM Category WHERE TC_Name = 'Plata')
BEGIN
    INSERT INTO Category (TID_Id, TC_Name, TC_Description, TB_IsActive)
    VALUES (
        @SilverCategoryId,
        'Plata',
        'Joyas elaboradas en plata',
        1
    );
END

IF EXISTS (SELECT 1 FROM Category WHERE TID_Id = @GreenSilverCategoryId)
BEGIN
    UPDATE Category
    SET
        TC_Name = 'Plata verde',
        TC_Description = 'Joyas de plata con acentos verdes',
        TB_IsActive = 1,
        TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @GreenSilverCategoryId;
END
ELSE IF NOT EXISTS (SELECT 1 FROM Category WHERE TC_Name = 'Plata verde')
BEGIN
    INSERT INTO Category (TID_Id, TC_Name, TC_Description, TB_IsActive)
    VALUES (
        @GreenSilverCategoryId,
        'Plata verde',
        'Joyas de plata con acentos verdes',
        1
    );
END

IF EXISTS (SELECT 1 FROM Category WHERE TID_Id = @GoldCategoryId)
BEGIN
    UPDATE Category
    SET
        TC_Name = 'Oro',
        TC_Description = 'Joyas elaboradas en oro',
        TB_IsActive = 1,
        TD_UpdatedAt = SYSDATETIME()
    WHERE TID_Id = @GoldCategoryId;
END
ELSE IF NOT EXISTS (SELECT 1 FROM Category WHERE TC_Name = 'Oro')
BEGIN
    INSERT INTO Category (TID_Id, TC_Name, TC_Description, TB_IsActive)
    VALUES (
        @GoldCategoryId,
        'Oro',
        'Joyas elaboradas en oro',
        1
    );
END

UPDATE Category
SET
    TB_IsActive = 0,
    TD_UpdatedAt = SYSDATETIME()
WHERE TC_Name IN ('Anillos', 'Collares', 'Aretes', 'Brazaletes');

