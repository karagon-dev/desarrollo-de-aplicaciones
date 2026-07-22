-- Demo customer profile (user: customer@example.com / MiClave123)

IF NOT EXISTS (
    SELECT 1
    FROM CustomerProfile
    WHERE TID_UserId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
)
BEGIN
    INSERT INTO CustomerProfile (
        TID_Id,
        TID_UserId,
        TC_IdentificationNumber,
        TC_FirstName,
        TC_LastName,
        TD_BirthDate,
        TC_Phone
    )
    VALUES (
        'e5f6a7b8-c9d0-1234-ef01-345678901234',
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        '1234567890',
        'Maria',
        'Garcia',
        '1990-05-20',
        '+573001234567'
    );
END

-- Profile for maria.garcia@skama.com

IF NOT EXISTS (
    SELECT 1
    FROM CustomerProfile
    WHERE TID_UserId = '22222222-2222-2222-2222-222222222222'
)
BEGIN
    INSERT INTO CustomerProfile (
        TID_Id,
        TID_UserId,
        TC_IdentificationNumber,
        TC_FirstName,
        TC_LastName,
        TD_BirthDate,
        TC_Phone
    )
    VALUES (
        'e5f6a7b8-c9d0-1234-ef01-345678901235',
        '22222222-2222-2222-2222-222222222222',
        '9876543210',
        'Maria',
        'Lopez',
        '1988-11-03',
        '+573109876543'
    );
END
