# SKAMA API — Documentación de Endpoints

Base URL de ejemplo: `https://localhost:7xxx`

Todas las respuestas JSON usan **camelCase**. Los identificadores son `GUID` en formato estándar.

**Códigos HTTP comunes**

| Código | Significado |
|--------|-------------|
| `200` | OK — solicitud exitosa con cuerpo |
| `201` | Created — recurso creado |
| `204` | No Content — operación exitosa sin cuerpo |
| `400` | Bad Request — validación o regla de negocio |
| `401` | Unauthorized |
| `404` | Not Found |
| `409` | Conflict — duplicado o estado incompatible |

Los errores de negocio suelen devolver `ProblemDetails`:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Título del error",
  "status": 400,
  "detail": "Descripción del error"
}
```

---

## Auth (`/api/auth`)

### POST `/api/auth/register`

Registra un nuevo usuario.

**Request body**

```json
{
  "email": "cliente@ejemplo.com",
  "password": "MiClave123",
  "confirmPassword": "MiClave123"
}
```

**Response `201 Created`**

```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

**Errores:** `400` validación · `409` email ya registrado

---

### POST `/api/auth/login`

Inicia sesión.

**Request body**

```json
{
  "email": "cliente@ejemplo.com",
  "password": "MiClave123"
}
```

**Response `200 OK`**

```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "cliente@ejemplo.com",
  "roleId": 2,
  "roleName": "Customer",
  "isActive": true
}
```

**Errores:** `400` validación · `401` credenciales inválidas

---

### GET `/api/auth/users/{id}`

Obtiene un usuario por Id.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | GUID | Id del usuario |

**Response `200 OK`**

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "roleId": 2,
  "roleName": "Customer",
  "email": "cliente@ejemplo.com",
  "isActive": true,
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": null
}
```

**Errores:** `404` usuario no encontrado

---

### GET `/api/auth/users/by-email/{email}`

Obtiene un usuario por email.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `email` | string | Email del usuario |

**Response `200 OK`** — mismo formato que `UserDto` (ver arriba).

**Errores:** `404`

---

### PATCH `/api/auth/users/{id}/status`

Activa o desactiva un usuario.

**Parámetros de ruta:** `id` (GUID)

**Request body**

```json
{
  "isActive": false
}
```

**Response `204 No Content`** — sin cuerpo.

**Errores:** `400` · `404` usuario no encontrado

---

### POST `/api/auth/forgot-password`

Solicita recuperación de contraseña.

**Request body**

```json
{
  "email": "cliente@ejemplo.com"
}
```

**Response `200 OK`**

```json
{
  "message": "Si el correo existe, se enviará un enlace de recuperación.",
  "resetToken": "token-opcional-en-desarrollo"
}
```

---

### POST `/api/auth/reset-password`

Restablece la contraseña con un token válido.

**Request body**

```json
{
  "token": "abc123-reset-token",
  "newPassword": "NuevaClave456",
  "confirmPassword": "NuevaClave456"
}
```

**Response `204 No Content`**

**Errores:** `400` token inválido o expirado · `404` token no encontrado

---

## Cart (`/api/cart`)

### POST `/api/cart/user/{userId}`

Obtiene o crea el carrito activo del usuario.

**Parámetros de ruta:** `userId` (GUID)

**Response `200 OK`**

```json
{
  "cartId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### GET `/api/cart/user/{userId}`

Obtiene el carrito activo del usuario.

**Parámetros de ruta:** `userId` (GUID)

**Response `200 OK`**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": "ACTIVE",
  "createdAt": "2026-03-01T08:00:00Z",
  "updatedAt": "2026-03-01T09:15:00Z"
}
```

**Errores:** `404` sin carrito activo

---

### GET `/api/cart/{cartId}`

Obtiene el detalle del carrito con ítems y total.

**Parámetros de ruta:** `cartId` (GUID)

**Response `200 OK`**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": "ACTIVE",
  "createdAt": "2026-03-01T08:00:00Z",
  "updatedAt": "2026-03-01T09:15:00Z",
  "total": 1250.00,
  "items": [
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "productName": "Anillo Esmeralda",
      "quantity": 1,
      "unitPrice": 1250.00,
      "subtotal": 1250.00,
      "stockQuantity": 5,
      "isActive": true
    }
  ]
}
```

**Errores:** `404`

---

### POST `/api/cart/{cartId}/items`

Agrega un producto al carrito.

**Parámetros de ruta:** `cartId` (GUID)

**Request body**

```json
{
  "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "quantity": 2
}
```

**Response `201 Created`**

```json
{
  "cartItemId": "b2c3d4e5-f6a7-8901-bcde-f12345678901"
}
```

**Errores:** `400` stock insuficiente, producto inactivo, etc.

---

### PUT `/api/cart/items/{cartItemId}`

Actualiza la cantidad de un ítem.

**Parámetros de ruta:** `cartItemId` (GUID)

**Request body**

```json
{
  "quantity": 3
}
```

**Response `204 No Content`**

**Errores:** `400` · `404` ítem no encontrado

---

### DELETE `/api/cart/items/{cartItemId}`

Elimina un ítem del carrito.

**Parámetros de ruta:** `cartItemId` (GUID)

**Response `204 No Content`**

**Errores:** `404`

---

## Categories (`/api/categories`)

### GET `/api/categories`

Lista categorías.

**Query parameters**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `includeInactive` | bool | `false` | Incluir categorías inactivas |

**Ejemplo:** `GET /api/categories?includeInactive=false`

**Response `200 OK`**

```json
[
  {
    "id": "d4e5f6a7-b8c9-0123-def0-234567890123",
    "name": "Anillos",
    "description": "Anillos con esmeralda",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": null
  }
]
```

---

### GET `/api/categories/{id}`

Obtiene una categoría por Id.

**Response `200 OK`** — objeto `CategoryDto` (ver arriba).

**Errores:** `404`

---

### POST `/api/categories`

Crea una categoría.

**Request body**

```json
{
  "name": "Collares",
  "description": "Collares con esmeralda colombiana"
}
```

**Response `201 Created`**

```json
{
  "id": "d4e5f6a7-b8c9-0123-def0-234567890123"
}
```

---

### PUT `/api/categories/{id}`

Actualiza una categoría.

**Request body**

```json
{
  "name": "Collares Premium",
  "description": "Descripción actualizada",
  "isActive": true
}
```

**Response `204 No Content`**

**Errores:** `400` · `404`

---

### DELETE `/api/categories/{id}`

Elimina lógicamente una categoría (soft delete).

**Response `204 No Content`**

**Errores:** `404`

---

## Clients (`/api/clients`)

### GET `/api/clients/{userId}/profile`

Obtiene el perfil de cliente.

**Parámetros de ruta:** `userId` (GUID)

**Response `200 OK`**

```json
{
  "id": "e5f6a7b8-c9d0-1234-ef01-345678901234",
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "identificationNumber": "1234567890",
  "firstName": "María",
  "lastName": "García",
  "birthDate": "1990-05-20",
  "phone": "+573001234567",
  "createdAt": "2026-01-10T12:00:00Z",
  "updatedAt": null
}
```

**Errores:** `404`

---

### PUT `/api/clients/{userId}/profile`

Crea o actualiza el perfil de cliente.

**Request body**

```json
{
  "identificationNumber": "1234567890",
  "firstName": "María",
  "lastName": "García",
  "birthDate": "1990-05-20",
  "phone": "+573001234567"
}
```

**Response `200 OK`**

```json
{
  "profileId": "e5f6a7b8-c9d0-1234-ef01-345678901234"
}
```

**Errores:** `400` · `409` conflicto (ej. identificación duplicada)

---

## Dashboard (`/api/dashboard`)

### GET `/api/dashboard/summary`

Indicadores del negocio para el panel admin.

**Query parameters**

| Parámetro | Tipo | Formato | Descripción |
|-----------|------|---------|-------------|
| `startDate` | DateOnly | `YYYY-MM-DD` | Fecha inicial |
| `endDate` | DateOnly | `YYYY-MM-DD` | Fecha final |

**Ejemplo:** `GET /api/dashboard/summary?startDate=2026-01-01&endDate=2026-01-31`

**Response `200 OK`**

```json
{
  "totalSales": 45230.50,
  "totalOrders": 38,
  "averageOrderValue": 1190.28,
  "registeredCustomers": 120,
  "lowStockProducts": 4,
  "topProducts": [
    {
      "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "productName": "Anillo Esmeralda",
      "totalQuantitySold": 15,
      "totalSales": 18750.00
    }
  ]
}
```

**Errores:** `400` si `endDate` es anterior a `startDate`

---

## Inventory (`/api/inventory`)

### POST `/api/inventory/movements`

Registra un movimiento de inventario.

**Request body**

```json
{
  "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "movementType": "MANUAL_ADJUSTMENT",
  "quantity": 10,
  "referenceOrderId": null
}
```

**Valores de `movementType`:** `SALE` · `RETURN` · `MANUAL_ADJUSTMENT`

**Response `201 Created`**

```json
{
  "id": "f6a7b8c9-d0e1-2345-f012-456789012345"
}
```

**Errores:** `400` validación o stock insuficiente · `404` producto no encontrado

---

### GET `/api/inventory/movements/product/{productId}`

Historial de movimientos de un producto.

**Response `200 OK`**

```json
[
  {
    "id": "f6a7b8c9-d0e1-2345-f012-456789012345",
    "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "movementType": "MANUAL_ADJUSTMENT",
    "quantity": 10,
    "previousStock": 5,
    "newStock": 15,
    "referenceOrderId": null,
    "createdAt": "2026-03-01T14:00:00Z"
  }
]
```

---

### GET `/api/inventory/low-stock`

Productos activos con stock ≤ mínimo.

**Response `200 OK`**

```json
[
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "name": "Anillo Esmeralda",
    "stockQuantity": 2,
    "minimumStock": 5,
    "isActive": true
  }
]
```

---

## Notifications (`/api/notifications`)

### GET `/api/notifications/pending`

Lista correos pendientes de envío.

**Response `200 OK`**

```json
[
  {
    "id": "a7b8c9d0-e1f2-3456-0123-567890123456",
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "orderId": "b8c9d0e1-f2a3-4567-1234-678901234567",
    "type": "ORDER_CONFIRMATION",
    "recipientEmail": "cliente@ejemplo.com",
    "subject": "Confirmación de pedido #ORD-001",
    "status": "PENDING",
    "sentAt": null,
    "createdAt": "2026-03-01T10:00:00Z"
  }
]
```

**Tipos válidos:** `ORDER_CONFIRMATION` · `ORDER_STATUS_UPDATE` · `PASSWORD_RESET`

---

### POST `/api/notifications`

Registra una notificación de correo.

**Request body**

```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "orderId": "b8c9d0e1-f2a3-4567-1234-678901234567",
  "type": "ORDER_CONFIRMATION",
  "recipientEmail": "cliente@ejemplo.com",
  "subject": "Confirmación de pedido #ORD-001"
}
```

**Response `201 Created`**

```json
{
  "id": "a7b8c9d0-e1f2-3456-0123-567890123456"
}
```

**Errores:** `400` tipo inválido

---

### PATCH `/api/notifications/{id}/sent`

Marca una notificación como enviada.

**Response `204 No Content`**

**Errores:** `404`

---

### PATCH `/api/notifications/{id}/failed`

Marca una notificación como fallida.

**Response `204 No Content`**

**Errores:** `404`

---

## Orders (`/api/orders`)

### POST `/api/orders/from-cart/{cartId}`

Crea una orden desde un carrito.

**Parámetros de ruta:** `cartId` (GUID)

**Request body**

```json
{
  "paymentMethod": "CREDIT_CARD",
  "shippingAddress": "Calle 123 #45-67, Bogotá"
}
```

**Response `201 Created`**

```json
{
  "orderId": "b8c9d0e1-f2a3-4567-1234-678901234567",
  "orderNumber": "ORD-20260301-001"
}
```

**Errores:** `400` carrito vacío, sin stock, etc.

---

### GET `/api/orders/{orderId}`

Obtiene una orden por Id.

**Response `200 OK`**

```json
{
  "id": "b8c9d0e1-f2a3-4567-1234-678901234567",
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "orderNumber": "ORD-20260301-001",
  "status": "PAID",
  "paymentMethod": "CREDIT_CARD",
  "shippingAddress": "Calle 123 #45-67, Bogotá",
  "subtotal": 1250.00,
  "discountTotal": 0.00,
  "total": 1250.00,
  "createdAt": "2026-03-01T11:00:00Z",
  "updatedAt": null
}
```

**Errores:** `404`

---

### GET `/api/orders/user/{userId}`

Lista órdenes de un usuario.

**Response `200 OK`** — array de `OrderDto`.

---

### GET `/api/orders/{orderId}/detail`

Detalle de orden con ítems.

**Response `200 OK`**

```json
{
  "id": "b8c9d0e1-f2a3-4567-1234-678901234567",
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "orderNumber": "ORD-20260301-001",
  "status": "PAID",
  "paymentMethod": "CREDIT_CARD",
  "shippingAddress": "Calle 123 #45-67, Bogotá",
  "subtotal": 1250.00,
  "discountTotal": 0.00,
  "total": 1250.00,
  "createdAt": "2026-03-01T11:00:00Z",
  "updatedAt": null,
  "items": [
    {
      "id": "c9d0e1f2-a3b4-5678-2345-789012345678",
      "orderId": "b8c9d0e1-f2a3-4567-1234-678901234567",
      "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "productName": "Anillo Esmeralda",
      "quantity": 1,
      "unitPrice": 1250.00,
      "discountAmount": 0.00,
      "lineTotal": 1250.00
    }
  ]
}
```

**Errores:** `404`

---

### PATCH `/api/orders/{orderId}/status`

Actualiza el estado de una orden.

**Request body**

```json
{
  "status": "SHIPPED"
}
```

**Response `204 No Content`**

**Errores:** `400` estado inválido · `404` orden no encontrada

---

### POST `/api/orders/{orderId}/cancel`

Cancela una orden.

**Response `204 No Content`**

**Errores:** `404` · `409` orden ya procesada

---

## Product Images

### GET `/api/products/{productId}/images`

Lista imágenes de un producto.

**Response `200 OK`**

```json
[
  {
    "id": "d0e1f2a3-b4c5-6789-3456-890123456789",
    "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "imageName": "a1b2c3d4e5f6789012345678abcdef01.webp",
    "imageUrl": "/images/products/a1b2c3d4e5f6789012345678abcdef01.webp",
    "isMain": true,
    "createdAt": null
  }
]
```

---

### POST `/api/products/{productId}/images`

Sube una imagen de producto.

**Content-Type:** `multipart/form-data`

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `file` | archivo | Sí | `.jpg`, `.jpeg`, `.png`, `.webp` (máx. 5 MB) |
| `isMain` | bool | No | Marcar como principal (default: `false`) |
| `altText` | string | No | Texto alternativo |
| `sortOrder` | int | No | Orden de visualización (default: `0`) |

**Response `201 Created`** — objeto `ProductImageDto` (ver arriba).

**Errores:** `400` archivo inválido · `404` producto no encontrado

---

### PUT `/api/product-images/{id}`

Actualiza metadata y/o reemplaza el archivo.

**Content-Type:** `multipart/form-data`

Mismos campos que POST; `file` es opcional.

**Response `200 OK`** — objeto `ProductImageDto`.

**Errores:** `400` · `404`

---

### DELETE `/api/product-images/{id}`

Elimina imagen de BD y del disco.

**Response `204 No Content`**

**Errores:** `404`

---

### PATCH `/api/product-images/{id}/main`

Marca la imagen como principal.

**Response `204 No Content`**

**Errores:** `404`

---

## Products (`/api/products`)

### GET `/api/products`

Lista productos con filtros opcionales.

**Query parameters**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `search` | string | — | Búsqueda por nombre |
| `categoryId` | GUID | — | Filtrar por categoría |
| `includeInactive` | bool | `false` | Incluir inactivos |

**Ejemplo:** `GET /api/products?search=anillo&categoryId=d4e5f6a7-b8c9-0123-def0-234567890123`

**Response `200 OK`**

```json
[
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "categoryId": "d4e5f6a7-b8c9-0123-def0-234567890123",
    "categoryName": "Anillos",
    "name": "Anillo Esmeralda",
    "description": "Anillo en oro con esmeralda colombiana",
    "price": 1250.00,
    "stockQuantity": 10,
    "minimumStock": 3,
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": null
  }
]
```

---

### GET `/api/products/{id}`

Obtiene un producto por Id.

**Response `200 OK`** — objeto `ProductDto` (ver arriba).

**Errores:** `404`

---

### POST `/api/products`

Crea un producto.

**Request body**

```json
{
  "categoryId": "d4e5f6a7-b8c9-0123-def0-234567890123",
  "name": "Anillo Esmeralda",
  "description": "Anillo en oro con esmeralda colombiana",
  "price": 1250.00,
  "stockQuantity": 10,
  "minimumStock": 3
}
```

**Response `201 Created`**

```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012"
}
```

---

### PUT `/api/products/{id}`

Actualiza un producto.

**Request body**

```json
{
  "categoryId": "d4e5f6a7-b8c9-0123-def0-234567890123",
  "name": "Anillo Esmeralda Premium",
  "description": "Descripción actualizada",
  "price": 1350.00,
  "stockQuantity": 8,
  "minimumStock": 3,
  "isActive": true
}
```

**Response `204 No Content`**

**Errores:** `400` · `404`

---

### DELETE `/api/products/{id}`

Elimina lógicamente un producto (soft delete).

**Response `204 No Content`**

**Errores:** `404`

---

## Promotions (`/api/promotions`)

### GET `/api/promotions/active`

Lista promociones activas.

**Response `200 OK`**

```json
[
  {
    "id": "e1f2a3b4-c5d6-7890-4567-901234567890",
    "name": "Descuento Primavera",
    "description": "15% en anillos",
    "discountPercentage": 15.00,
    "startDate": "2026-03-01",
    "endDate": "2026-03-31",
    "isActive": true,
    "createdAt": "2026-02-20T00:00:00Z",
    "updatedAt": null
  }
]
```

---

### POST `/api/promotions`

Crea una promoción.

**Request body**

```json
{
  "name": "Descuento Primavera",
  "description": "15% en anillos",
  "discountPercentage": 15.00,
  "startDate": "2026-03-01",
  "endDate": "2026-03-31"
}
```

**Response `201 Created`** — sin cuerpo estándar (referencia a `GetActive`).

**Errores:** `400`

---

### PUT `/api/promotions/{id}`

Actualiza una promoción.

**Request body**

```json
{
  "name": "Descuento Primavera",
  "description": "15% en anillos",
  "discountPercentage": 20.00,
  "startDate": "2026-03-01",
  "endDate": "2026-03-31",
  "isActive": true
}
```

**Response `204 No Content`**

**Errores:** `400` · `404`

---

### POST `/api/promotions/{promotionId}/products/{productId}`

Asigna un producto a una promoción.

**Response `201 Created`**

**Errores:** `409` producto ya asignado

---

### DELETE `/api/promotions/{promotionId}/products/{productId}`

Quita un producto de una promoción.

**Response `204 No Content`**

**Errores:** `404` asignación no encontrada

---

## Reports (`/api/reports`)

### GET `/api/reports/sales-by-period`

Ventas agrupadas por día.

**Query parameters**

| Parámetro | Tipo | Formato |
|-----------|------|---------|
| `startDate` | DateOnly | `YYYY-MM-DD` |
| `endDate` | DateOnly | `YYYY-MM-DD` |

**Ejemplo:** `GET /api/reports/sales-by-period?startDate=2026-01-01&endDate=2026-01-31`

**Response `200 OK`**

```json
[
  {
    "saleDate": "2026-01-15",
    "orderCount": 5,
    "subtotal": 6200.00,
    "discountTotal": 310.00,
    "total": 5890.00
  }
]
```

**Errores:** `400` rango de fechas inválido · lista vacía `[]` si no hay datos

---

### GET `/api/reports/sales-by-product`

Ventas agrupadas por producto.

**Query parameters:** `startDate`, `endDate` (mismo formato)

**Ejemplo:** `GET /api/reports/sales-by-product?startDate=2026-01-01&endDate=2026-01-31`

**Response `200 OK`**

```json
[
  {
    "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "productName": "Anillo Esmeralda",
    "totalQuantitySold": 12,
    "totalSales": 15000.00
  }
]
```

---

### GET `/api/reports/top-products`

Productos más vendidos en un período.

**Query parameters**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `startDate` | DateOnly | — | Fecha inicial |
| `endDate` | DateOnly | — | Fecha final |
| `top` | int | `5` | Cantidad de productos (debe ser > 0) |

**Ejemplo:** `GET /api/reports/top-products?startDate=2026-01-01&endDate=2026-01-31&top=5`

**Response `200 OK`**

```json
[
  {
    "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "productName": "Anillo Esmeralda",
    "totalQuantitySold": 12,
    "totalSales": 15000.00
  }
]
```

**Errores:** `400` fechas inválidas o `top` ≤ 0

---

## Reviews (`/api/reviews`)

### GET `/api/reviews/product/{productId}`

Reseñas de un producto.

**Response `200 OK`**

```json
[
  {
    "id": "f2a3b4c5-d6e7-8901-5678-012345678901",
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "orderId": "b8c9d0e1-f2a3-4567-1234-678901234567",
    "rating": 5,
    "comment": "Excelente calidad",
    "createdAt": "2026-02-15T16:00:00Z"
  }
]
```

---

### GET `/api/reviews/user/{userId}`

Reseñas escritas por un usuario.

**Response `200 OK`** — array de `ReviewDto`.

---

### POST `/api/reviews`

Crea una reseña.

**Request body**

```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "orderId": "b8c9d0e1-f2a3-4567-1234-678901234567",
  "rating": 5,
  "comment": "Excelente calidad"
}
```

**Response `201 Created`**

```json
{
  "reviewId": "f2a3b4c5-d6e7-8901-5678-012345678901"
}
```

**Errores:** `400` validación · `409` reseña duplicada

---

## Wishlist (`/api/wishlist`)

### GET `/api/wishlist/user/{userId}`

Lista favoritos del usuario.

**Response `200 OK`**

```json
[
  {
    "id": "a3b4c5d6-e7f8-9012-6789-123456789012",
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "productName": "Anillo Esmeralda",
    "price": 1250.00,
    "stockQuantity": 10,
    "isActive": true,
    "createdAt": "2026-03-01T12:00:00Z"
  }
]
```

---

### POST `/api/wishlist/user/{userId}`

Agrega un producto a favoritos.

**Request body**

```json
{
  "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012"
}
```

**Response `201 Created`**

```json
{
  "id": "a3b4c5d6-e7f8-9012-6789-123456789012"
}
```

**Errores:** `400` · `409` producto ya en favoritos

---

### DELETE `/api/wishlist/user/{userId}/product/{productId}`

Quita un producto de favoritos.

**Response `204 No Content`**

**Errores:** `404`

---

### POST `/api/wishlist/user/{userId}/toggle`

Alterna favorito (agrega si no existe, quita si existe).

**Request body**

```json
{
  "productId": "c3d4e5f6-a7b8-9012-cdef-123456789012"
}
```

**Response `200 OK`**

```json
{
  "isFavorite": true
}
```

---

## Resumen de endpoints

| Módulo | Cantidad |
|--------|----------|
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
| **Total** | **59** |
