# Documentación de Base de Datos Skama

## 1. Introducción

El presente documento describe el modelo relacional de la base de datos utilizada por la plataforma de comercio electrónico Skama. El esquema está diseñado para gestionar las entidades principales del negocio, incluyendo usuarios, productos, categorías, carritos de compra, pedidos, promociones, inventario y reseñas.

Motor de Base de Datos: Microsoft SQL Server
Nombre de la Base de Datos: skama-db

## 2. Tecnologías Utilizadas

- SQL Server (Edición Developer o Express)
- SQL Server Management Studio (SSMS)
- Git / GitHub para control de versiones

## 3. Guía de Instalación y Configuración

Para replicar este entorno de base de datos en una máquina local, siga los siguientes pasos:

1. Clonar el Repositorio
   Abra una terminal y ejecute:
   git clone https://github.com/karagon-dev/desarrollo-de-aplicaciones.git

2. Crear la Base de Datos
   Abra SSMS, conéctese a su instancia local (por ejemplo, .\SQLEXPRESS) y ejecute:
   CREATE DATABASE [skama-db];

3. Seleccionar la Base de Datos
   En el desplegable de la barra de herramientas de SSMS, asegúrese de que esté seleccionada la base de datos skama-db.

4. Ejecutar los Scripts en Orden
   Debido a las dependencias de claves foráneas, los scripts almacenados en la carpeta skama-db/tables/ deben ejecutarse en el siguiente orden estricto.
   (Nota: User y Order son palabras reservadas en SQL Server; por lo tanto, se referencian utilizando corchetes [User] y [Order] en los scripts).

   Orden de Ejecución:
   1. Role.sql
   2. Category.sql
   3. ResultCode.sql
   4. Promotion.sql
   5. User.sql
   6. Product.sql
   7. CustomerProfile.sql
   8. Cart.sql
   9. Order.sql
   10. ProductImage.sql
   11. WishlistItem.sql
   12. PasswordResetToken.sql
   13. PromotionProduct.sql
   14. CartItem.sql
   15. OrderItem.sql
   16. Review.sql
   17. EmailNotification.sql
   18. InventoryMovement.sql

## 4. Diagrama Entidad-Relación

El diagrama de base de datos se encuentra disponible en el archivo "diagram.jpg" adjunto en esta carpeta

## 5. Relaciones de Negocio Clave

- User a Order: Un único usuario puede tener múltiples pedidos (Relación Uno a Muchos).
- Order a OrderItem: Un pedido contiene múltiples líneas de productos (Relación Uno a Muchos).
- Product a Category: Un producto pertenece exactamente a una categoría (Relación Muchos a Uno).
- Cart a CartItem: Un carrito contiene múltiples elementos (Relación Uno a Muchos).
- Promotion a Product: Las promociones pueden aplicarse a múltiples productos, y los productos pueden tener múltiples promociones (Relación Muchos a Muchos), resuelta mediante la tabla intermedia PromotionProduct.
- User a Review: Un usuario puede dejar múltiples reseñas, pero solo una por producto (restringido por una restricción de unicidad).

## 6. Restricciones y Validaciones

Se han implementado varias restricciones de verificación (CHECK) para garantizar la integridad de los datos:

- Estado del Carrito: ACTIVE, CHECKED_OUT, ABANDONED
- Estado del Pedido: PENDING, PAID, SHIPPED, DELIVERED, CANCELLED
- Estado de Notificación por Correo: PENDING, SENT, FAILED
- Tipo de Movimiento de Inventario: SALE, RETURN, MANUAL_ADJUSTMENT
- Valoración de Reseñas: Restringida entre 1 y 5 estrellas.
- Precios y Cantidades: Todos los valores monetarios y cantidades de stock se validan para ser no negativos.