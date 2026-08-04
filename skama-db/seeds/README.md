# SKAMA - Datos de desarrollo

Ejecutar **después** de crear las tablas y los procedimientos almacenados.

## Ejecución rápida

```bash
sqlcmd -S localhost -d SkamaDb -E -i SeedAll.sql
```

También se puede ejecutar cada archivo manualmente en el orden indicado.

## Orden de ejecución

| # | Archivo | Tabla(s) |
|---|------|----------|
| 1 | `Role.sql` | Role |
| 2 | `ResultCode.sql` | ResultCode |
| 3 | `User.sql` | User |
| 4 | `Category.sql` | Category |
| 5 | `Product.sql` | Product |
| 6 | `CustomerProfile.sql` | CustomerProfile |
| 7 | `Promotion.sql` | Promotion |
| 8 | `PromotionProduct.sql` | PromotionProduct |
| 9 | `Order.sql` | Order, OrderItem |
| 10 | `Cart.sql` | Cart, CartItem |
| 11 | `WishlistItem.sql` | WishlistItem |
| 12 | `Review.sql` | Review |
| 13 | `InventoryMovement.sql` | InventoryMovement |
| 14 | `ProductImage.sql` | ProductImage |
| 15 | `EmailNotification.sql` | EmailNotification |
| 16 | `PasswordResetToken.sql` | PasswordResetToken |

Todos los scripts son **idempotentes** (`IF NOT EXISTS`) y pueden ejecutarse varias veces.

## Credenciales de prueba

| Rol | Correo | Contraseña |
|------|-------|----------|
| Admin | `admin@skama.com` | `MiClave123` |
| Cliente | `customer@example.com` | `MiClave123` |
| Cliente | `maria.garcia@skama.com` | `MiClave123` |

## Datos incluidos

### Catálogo

- **4 categorías**: anillos, collares, aretes y pulseras.
- **6 productos** con precios en COP.
- **2 productos con inventario bajo** para el dashboard: collar premium de esmeralda (2/5) y anillo solitario de esmeralda (1/2).
- **6 imágenes de producto** con URL de referencia; cargar archivos reales desde administración si se requieren vistas previas.

### Promociones

- **Spring Discount** (15%) en anillos y collares seleccionados.
- **Welcome to SKAMA** (10%) en pulseras.

### Órdenes

| Número | Cliente | Estado | Uso |
|--------|----------|--------|-----|
| ORD-20260215-001 | customer@example.com | DELIVERED | Reseña y reportes |
| ORD-20260301-001 | customer@example.com | SHIPPED | Historial |
| ORD-20260310-001 | customer@example.com | PAID | Notificación pendiente |
| ORD-20260320-001 | customer@example.com | CANCELLED | Cancelación |
| ORD-20260401-001 | maria.garcia@skama.com | DELIVERED | Reseña y segundo cliente |

### Carritos activos

- `customer@example.com`: anillo solitario de esmeralda x 1.
- `maria.garcia@skama.com`: aretes colgantes de esmeralda x 2.

### Favoritos, reseñas e inventario

- **3 elementos en favoritos**.
- **2 reseñas publicadas**: una por cliente.
- **6 movimientos de inventario**: ajustes, ventas y devolución.
- **4 notificaciones por correo**: SENT, FAILED y PENDING.
- **1 token de restablecimiento usado** para datos históricos.

### Perfiles

- Perfil completo para `customer@example.com` y `maria.garcia@skama.com`.

## Prueba de dashboard y reportes

Usar el rango de fechas **2026-01-01** a **2026-06-30** en el panel de administración para ver ventas y productos destacados con datos reales.

## Restablecimiento de contraseña

Los tokens válidos se generan mediante la API:

```http
POST /api/auth/forgot-password
{ "email": "customer@example.com" }
```

En desarrollo, la respuesta incluye `resetToken` para usarlo en `POST /api/auth/reset-password`.
