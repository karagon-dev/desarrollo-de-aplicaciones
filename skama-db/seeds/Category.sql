IF NOT EXISTS (SELECT 1 FROM Category WHERE TC_Name = 'Anillos')
BEGIN
    INSERT INTO Category (TID_Id, TC_Name, TC_Description, TB_IsActive)
    VALUES (
        'd4e5f6a7-b8c9-0123-def0-234567890123',
        'Anillos',
        'Anillos con esmeraldas colombianas',
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Category WHERE TC_Name = 'Collares')
BEGIN
    INSERT INTO Category (TID_Id, TC_Name, TC_Description, TB_IsActive)
    VALUES (
        'd4e5f6a7-b8c9-0123-def0-234567890124',
        'Collares',
        'Collares con esmeraldas colombianas',
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Category WHERE TC_Name = 'Aretes')
BEGIN
    INSERT INTO Category (TID_Id, TC_Name, TC_Description, TB_IsActive)
    VALUES (
        'd4e5f6a7-b8c9-0123-def0-234567890125',
        'Aretes',
        'Aretes con esmeraldas colombianas',
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM Category WHERE TC_Name = 'Brazaletes')
BEGIN
    INSERT INTO Category (TID_Id, TC_Name, TC_Description, TB_IsActive)
    VALUES (
        'd4e5f6a7-b8c9-0123-def0-234567890126',
        'Brazaletes',
        'Brazaletes con esmeraldas colombianas',
        1
    );
END
