IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 0)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (0, 'SUCCESS', 'Operation completed successfully');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 1)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (1, 'NOT_FOUND', 'Requested resource was not found');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 2)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (2, 'VALIDATION_ERROR', 'Validation failed');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 3)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (3, 'DUPLICATE_RECORD', 'Record already exists');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 10)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (10, 'USER_NOT_FOUND', 'User was not found');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 11)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (11, 'EMAIL_ALREADY_EXISTS', 'Email already exists');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 12)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (12, 'INVALID_CREDENTIALS', 'Invalid credentials');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 20)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (20, 'PRODUCT_NOT_FOUND', 'Product was not found');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 21)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (21, 'PRODUCT_INACTIVE', 'Product is inactive');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 22)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (22, 'INSUFFICIENT_STOCK', 'Not enough stock available');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 30)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (30, 'CART_NOT_FOUND', 'Cart was not found');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 31)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (31, 'CART_NOT_ACTIVE', 'Cart is not active');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 32)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (32, 'PRODUCT_ALREADY_IN_CART', 'Product already exists in cart');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 40)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (40, 'ORDER_NOT_FOUND', 'Order was not found');

IF NOT EXISTS (SELECT 1 FROM ResultCode WHERE TID_Id = 41)
    INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
    VALUES (41, 'ORDER_ALREADY_PROCESSED', 'Order already processed');
