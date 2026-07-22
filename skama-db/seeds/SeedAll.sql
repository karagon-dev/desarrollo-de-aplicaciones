/*
  SKAMA - Run all development seeds in order.
  Use with sqlcmd (adjust server and database):

  PowerShell:
    Set-Location c:\repos\skama\skama-db\seeds
    sqlcmd -S localhost -d "skama-db" -E -b -i SeedAll.sql

  CMD:
    cd /d c:\repos\skama\skama-db\seeds
    sqlcmd -S localhost -d "skama-db" -E -b -i SeedAll.sql

  Requires tables to be created first.
  SSMS note: enable Query > SQLCMD Mode so :r commands work.
*/

:ON ERROR EXIT

IF DB_ID(N'skama-db') IS NULL
BEGIN
    RAISERROR('Database [skama-db] does not exist in the current instance.', 16, 1);
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

PRINT 'SKAMA seeds completed.';
