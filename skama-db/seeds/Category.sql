IF NOT EXISTS (SELECT 1 FROM Category WHERE TC_Name = 'Rings')
BEGIN
    INSERT INTO Category (TID_Id, TC_Name, TC_Description, TB_IsActive)
    VALUES (
        'd4e5f6a7-b8c9-0123-def0-234567890123',
        'Rings',
        'Rings with Colombian emeralds',
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Category WHERE TC_Name = 'Necklaces')
BEGIN
    INSERT INTO Category (TID_Id, TC_Name, TC_Description, TB_IsActive)
    VALUES (
        'd4e5f6a7-b8c9-0123-def0-234567890124',
        'Necklaces',
        'Necklaces with Colombian emeralds',
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Category WHERE TC_Name = 'Earrings')
BEGIN
    INSERT INTO Category (TID_Id, TC_Name, TC_Description, TB_IsActive)
    VALUES (
        'd4e5f6a7-b8c9-0123-def0-234567890125',
        'Earrings',
        'Earrings with Colombian emeralds',
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Category WHERE TC_Name = 'Bracelets')
BEGIN
    INSERT INTO Category (TID_Id, TC_Name, TC_Description, TB_IsActive)
    VALUES (
        'd4e5f6a7-b8c9-0123-def0-234567890126',
        'Bracelets',
        'Bracelets with Colombian emeralds',
        1
    );
END
