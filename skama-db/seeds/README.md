# SKAMA — Seeds de datos de desarrollo

Ejecutar **después** de crear tablas y stored procedures.

## Ejecución rápida

```bash
sqlcmd -S localhost -d SkamaDb -E -i SeedAll.sql
```

O ejecutar cada archivo manualmente en el orden indicado abajo.

## Orden de ejecución

| # | Archivo | Tabla(s) |
|---|---------|----------|
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

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin@skama.com` | `MiClave123` |
| Cliente | `cliente@ejemplo.com` | `MiClave123` |
| Cliente | `maria.garcia@skama.com` | `MiClave123` |

## Datos incluidos

### Catálogo
- **4 categorías**: Anillos, Collares, Aretes, Pulseras
- **6 productos** con precios en COP
- **2 productos con stock bajo** (dashboard): Collar Premium (2/5), Anillo Solitario (1/2)
- **6 imágenes** de producto (URLs de referencia; subir archivos reales vía admin si se desea vista previa)

### Promociones
- **Descuento Primavera** (15%) en anillos y collares seleccionados
- **Bienvenida SKAMA** (10%) en pulsera

### Pedidos (5)
| Número | Cliente | Estado | Uso |
|--------|---------|--------|-----|
| ORD-20260215-001 | cliente@ejemplo.com | DELIVERED | Reseña + reportes |
| ORD-20260301-001 | cliente@ejemplo.com | SHIPPED | Historial |
| ORD-20260310-001 | cliente@ejemplo.com | PAID | Notificación pendiente |
| ORD-20260320-001 | cliente@ejemplo.com | CANCELLED | Cancelación |
| ORD-20260401-001 | maria.garcia@skama.com | DELIVERED | Reseña + segundo cliente |

### Carritos activos
- `cliente@ejemplo.com`: Anillo Solitario × 1
- `maria.garcia@skama.com`: Aretes × 2

### Favoritos, reseñas, inventario
- **3 ítems** en wishlist
- **2 reseñas** publicadas (una por cliente)
- **6 movimientos** de inventario (ajustes, ventas, devolución)
- **4 notificaciones** de correo (SENT, FAILED, PENDING)
- **1 token** de reset usado (histórico)

### Perfiles
- Perfil completo para `cliente@ejemplo.com` y `maria.garcia@skama.com`

## Probar el dashboard y reportes

Usa rango de fechas **2026-01-01** a **2026-06-30** en el panel admin para ver ventas y productos top con datos reales.

## Reset de contraseña

Los tokens válidos se generan vía API:

```http
POST /api/auth/forgot-password
{ "email": "cliente@ejemplo.com" }
```

En desarrollo la respuesta incluye `resetToken` para usar en `POST /api/auth/reset-password`.
