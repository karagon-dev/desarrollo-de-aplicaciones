/*
  SKAMA - RF-004 calificacion de productos.

  Ejecutar en bases existentes antes de actualizar stored procedures.
*/

IF OBJECT_ID('dbo.UQ_Reviews_User_Product', 'UQ') IS NOT NULL
BEGIN
    ALTER TABLE dbo.Review
    DROP CONSTRAINT UQ_Reviews_User_Product;
END;
GO

IF OBJECT_ID('dbo.UQ_Reviews_User_Product_Order', 'UQ') IS NULL
BEGIN
    ALTER TABLE dbo.Review
    ADD CONSTRAINT UQ_Reviews_User_Product_Order
        UNIQUE (TID_UserId, TID_ProductId, TID_OrderId);
END;
GO
