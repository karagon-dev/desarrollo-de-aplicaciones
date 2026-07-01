INSERT INTO ResultCode (TID_Id, TC_Code, TC_Description)
VALUES
(0, 'SUCCESS', 'Operation completed successfully'),

(1, 'NOT_FOUND', 'Requested resource was not found'),
(2, 'VALIDATION_ERROR', 'Validation failed'),
(3, 'DUPLICATE_RECORD', 'Record already exists'),

(10, 'USER_NOT_FOUND', 'User was not found'),
(11, 'EMAIL_ALREADY_EXISTS', 'Email already exists'),
(12, 'INVALID_CREDENTIALS', 'Invalid credentials'),

(20, 'PRODUCT_NOT_FOUND', 'Product was not found'),
(21, 'PRODUCT_INACTIVE', 'Product is inactive'),
(22, 'INSUFFICIENT_STOCK', 'Not enough stock available'),

(30, 'CART_NOT_FOUND', 'Cart was not found'),
(31, 'CART_NOT_ACTIVE', 'Cart is not active'),
(32, 'PRODUCT_ALREADY_IN_CART', 'Product already exists in cart'),

(40, 'ORDER_NOT_FOUND', 'Order was not found'),
(41, 'ORDER_ALREADY_PROCESSED', 'Order already processed');
GO
