-- Development users (password: MiClave123)
-- ADMIN  -> admin@skama.com
-- CUSTOMER -> customer@example.com

DECLARE @AdminRoleId INT = (SELECT TID_Id FROM Role WHERE TC_Name = 'ADMIN');
DECLARE @CustomerRoleId INT = (SELECT TID_Id FROM Role WHERE TC_Name = 'CUSTOMER');

DECLARE @PasswordHash NVARCHAR(255) = '$2a$11$4pRgZUVe2rkWD0R3F02ofuLfZTj6egICCD8dKGgHpaDrvtRbEoXmy';

IF NOT EXISTS (SELECT 1 FROM [User] WHERE TC_Email = 'admin@skama.com')
BEGIN
    INSERT INTO [User] (TID_Id, TN_RoleId, TC_Email, TC_PasswordHash, TB_IsActive)
    VALUES (
        '11111111-1111-1111-1111-111111111111',
        @AdminRoleId,
        'admin@skama.com',
        @PasswordHash,
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM [User] WHERE TC_Email = 'customer@example.com')
BEGIN
    INSERT INTO [User] (TID_Id, TN_RoleId, TC_Email, TC_PasswordHash, TB_IsActive)
    VALUES (
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        @CustomerRoleId,
        'customer@example.com',
        @PasswordHash,
        1
    );
END

IF NOT EXISTS (SELECT 1 FROM [User] WHERE TC_Email = 'maria.garcia@skama.com')
BEGIN
    INSERT INTO [User] (TID_Id, TN_RoleId, TC_Email, TC_PasswordHash, TB_IsActive)
    VALUES (
        '22222222-2222-2222-2222-222222222222',
        @CustomerRoleId,
        'maria.garcia@skama.com',
        @PasswordHash,
        1
    );
END
