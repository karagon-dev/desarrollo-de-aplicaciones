# Alineación API - Prototipo SKAMA

Referencia usada: `ENDPOINTS.md` del usuario.

## Cobertura

La app ahora expone los 59 endpoints documentados bajo `/api/...`, agrupados así:

| Módulo | Cantidad |
| --- | ---: |
| Auth | 7 |
| Cart | 6 |
| Categories | 5 |
| Clients | 2 |
| Dashboard | 1 |
| Inventory | 3 |
| Notifications | 4 |
| Orders | 6 |
| Product Images | 5 |
| Products | 5 |
| Promotions | 5 |
| Reports | 3 |
| Reviews | 3 |
| Wishlist | 4 |

El catálogo fuente está en `Contracts/Api/SkamaApiEndpoints.cs` y mantiene `ExpectedCount = 59`.

## Datos visuales del prototipo que no son contrato API

Estos campos existen en la interfaz actual, pero no están en `ENDPOINTS.md`. No deben asumirse como datos de backend hasta ampliar formalmente el contrato:

- Colecciones: no existe endpoint `/api/collections`. En el API documentado el filtro real de productos es `categoryId`; el texto "Colección ..." queda como copy/metadata visual del frontend.
- Producto visual: `badge`, `badgeTone`, `ratingLabel`, `oldPrice`, `actionLabel`, `isLimitedEdition` y textos editoriales no forman parte de `ProductDto`.
- Detalle de producto: material, talla, largo de cadena, peso, origen, certificación y servicios son contenido visual/editorial; el API solo promete producto, imágenes, categorías, reviews y wishlist.
- Checkout por WhatsApp: el prototipo pide nombre, segundo apellido, país, provincia, ciudad, deliveryType, dedicatoria y mensaje de WhatsApp. El endpoint de orden solo recibe `paymentMethod` y `shippingAddress`; el perfil de cliente solo recibe identificación, nombre, apellido, fecha de nacimiento y teléfono.
- Admin: `/admin/collections` y `/admin/settings` son pantallas visuales. No se agregaron endpoints API para esos módulos porque no están documentados.
- Newsletter o suscripción: no existe endpoint documentado.

## Mapeos seguros para integración futura

- Catálogo: usar `GET /api/categories` para opciones de categoría y `GET /api/products?categoryId=...` para filtrar. Mantener el copy "Colecciones" si se quiere preservar la interfaz, pero internamente mapearlo a categorías.
- Carrito: reemplazar `localStorage` por `/api/cart/user/{userId}`, `/api/cart/{cartId}/items`, `PUT /api/cart/items/{cartItemId}` y `DELETE /api/cart/items/{cartItemId}` cuando exista usuario autenticado.
- Favoritos: reemplazar favoritos en `localStorage` por `/api/wishlist/user/{userId}` y `/api/wishlist/user/{userId}/toggle`.
- Pedido: crear orden con `POST /api/orders/from-cart/{cartId}` enviando solo `paymentMethod` y `shippingAddress`. Los datos extra del formulario necesitan contrato nuevo o persistencia separada.
- Registro: `POST /api/auth/register` solo crea credenciales. Los datos personales deben enviarse después a `PUT /api/clients/{userId}/profile`, dentro de los campos que ese endpoint acepta.
