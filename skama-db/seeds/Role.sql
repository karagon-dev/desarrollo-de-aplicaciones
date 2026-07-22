IF NOT EXISTS (SELECT 1 FROM Role WHERE TC_Name = 'ADMIN')
BEGIN
    INSERT INTO Role (TC_Name, TC_Description)
    VALUES ('ADMIN', 'Administrador del sistema');
END

IF NOT EXISTS (SELECT 1 FROM Role WHERE TC_Name = 'CUSTOMER')
BEGIN
    INSERT INTO Role (TC_Name, TC_Description)
    VALUES ('CUSTOMER', 'Store customer');
END
