/*
  SKAMA — Ejecutar todos los seeds de desarrollo en orden.
  Uso con sqlcmd (ajusta servidor y base de datos):

  PowerShell:
    Set-Location c:\repos\desarrollo-de-aplicaciones\skama-db\seeds
    sqlcmd -S localhost -d "skama-db" -E -b -i SeedAll.sql

  CMD:
    cd /d c:\repos\desarrollo-de-aplicaciones\skama-db\seeds
    sqlcmd -S localhost -d "skama-db" -E -b -i SeedAll.sql

  Requiere tablas ya creadas.
  Nota SSMS: habilitar Query > SQLCMD Mode para que funcionen los :r.
*/

:ON ERROR EXIT

IF DB_ID(N'skama-db') IS NULL
BEGIN
    RAISERROR('La base de datos [skama-db] no existe en la instancia actual.', 16, 1);
    RETURN;
END;
GO

USE [skama-db];
GO

:r Role.sql
:r ResultCode.sql
:r User.sql
:r Category.sql
:r Product.sql
:r CustomerProfile.sql
:r Promotion.sql
:r PromotionProduct.sql
:r Order.sql
:r Cart.sql
:r WishlistItem.sql
:r Review.sql
:r InventoryMovement.sql
:r ProductImage.sql
:r EmailNotification.sql
:r PasswordResetToken.sql

PRINT 'SKAMA seeds completados.';
