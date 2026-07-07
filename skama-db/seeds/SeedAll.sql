/*
  SKAMA — Ejecutar todos los seeds de desarrollo en orden.
  Uso con sqlcmd (ajusta servidor y base de datos):

  sqlcmd -S localhost -d SkamaDb -E -i SeedAll.sql

  Requiere tablas y stored procedures ya creados.
*/

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
