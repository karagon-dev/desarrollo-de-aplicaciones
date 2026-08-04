IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 0)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (0, 'SUCCESS', 'Operación completada correctamente');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 1)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (1, 'NOT_FOUND', 'Recurso solicitado no encontrado');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 2)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (2, 'VALIDATION_ERROR', 'Validación fallida');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 3)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (3, 'DUPLICATE_RECORD', 'Registro duplicado');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 10)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (10, 'USER_NOT_FOUND', 'Usuario no encontrado');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 11)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (11, 'EMAIL_ALREADY_EXISTS', 'Correo ya registrado');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 12)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (12, 'INVALID_CREDENTIALS', 'Credenciales inválidas');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 20)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (20, 'PRODUCT_NOT_FOUND', 'Producto no encontrado');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 21)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (21, 'PRODUCT_INACTIVE', 'Producto inactivo');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 22)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (22, 'INSUFFICIENT_STOCK', 'Inventario insuficiente');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 30)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (30, 'CART_NOT_FOUND', 'Carrito no encontrado');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 31)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (31, 'CART_NOT_ACTIVE', 'Carrito inactivo');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 32)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (32, 'PRODUCT_ALREADY_IN_CART', 'Producto ya existe en el carrito');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 40)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (40, 'ORDER_NOT_FOUND', 'Orden no encontrada');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 41)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (41, 'ORDER_ALREADY_PROCESSED', 'Orden ya procesada');
