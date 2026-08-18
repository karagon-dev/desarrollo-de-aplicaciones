/*
  SKAMA - Visibilidad por stock y alertas de reposicion.

  Ejecutar en bases existentes antes de actualizar stored procedures.
*/

IF OBJECT_ID('dbo.CK_EmailNotifications_Type', 'C') IS NOT NULL
BEGIN
    ALTER TABLE dbo.EmailNotification
    DROP CONSTRAINT CK_EmailNotifications_Type;
END;
GO

ALTER TABLE dbo.EmailNotification
ADD CONSTRAINT CK_EmailNotifications_Type
    CHECK (TC_Type IN ('ORDER_CONFIRMATION', 'ORDER_STATUS_UPDATE', 'PASSWORD_RESET', 'LOW_STOCK_ALERT'));
GO
