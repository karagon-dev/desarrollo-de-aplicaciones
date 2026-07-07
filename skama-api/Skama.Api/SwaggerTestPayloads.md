# Swagger test payloads (all controllers)

Use these values to test endpoint-by-endpoint in Swagger.

## Shared sample IDs
- `userId`: `11111111-1111-1111-1111-111111111111`
- `categoryId`: `22222222-2222-2222-2222-222222222222`
- `productId`: `33333333-3333-3333-3333-333333333333`
- `cartId`: `44444444-4444-4444-4444-444444444444`
- `cartItemId`: `55555555-5555-5555-5555-555555555555`
- `orderId`: `66666666-6666-6666-6666-666666666666`
- `promotionId`: `77777777-7777-7777-7777-777777777777`
- `reviewId`: `88888888-8888-8888-8888-888888888888`
- `notificationId`: `99999999-9999-9999-9999-999999999999`
- `productImageId`: `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`

---

## Auth (`/api/Auth`)
- `POST /api/Auth/register`
```json
{
  "email": "user@example.com",
  "password": "Passw0rd!",
  "confirmPassword": "Passw0rd!"
}
```

- `POST /api/Auth/login`
```json
{
  "email": "user@example.com",
  "password": "Passw0rd!"
}
```

- `GET /api/Auth/users/{id}`
  - Path: `id = 11111111-1111-1111-1111-111111111111`

- `GET /api/Auth/users/by-email/{email}`
  - Path: `email = user@example.com`

- `PATCH /api/Auth/users/{id}/status`
```json
{
  "isActive": true
}
```

- `POST /api/Auth/forgot-password`
```json
{
  "email": "user@example.com"
}
```

- `POST /api/Auth/reset-password`
```json
{
  "token": "sample-reset-token",
  "newPassword": "NewPassw0rd!",
  "confirmPassword": "NewPassw0rd!"
}
```

---

## Cart (`/api/Cart`)
- `POST /api/Cart/user/{userId}`
  - Path only, no body.

- `GET /api/Cart/user/{userId}`
  - Path only, no body.

- `GET /api/Cart/{cartId}`
  - Path only, no body.

- `POST /api/Cart/{cartId}/items`
```json
{
  "productId": "33333333-3333-3333-3333-333333333333",
  "quantity": 2
}
```

- `PUT /api/Cart/items/{cartItemId}`
```json
{
  "quantity": 3
}
```

- `DELETE /api/Cart/items/{cartItemId}`
  - Path only, no body.

---

## Categories (`/api/Categories`)
- `GET /api/Categories?includeInactive=false`
  - Query only, no body.

- `GET /api/Categories/{id}`
  - Path only, no body.

- `POST /api/Categories`
```json
{
  "name": "Electronics",
  "description": "Devices and accessories"
}
```

- `PUT /api/Categories/{id}`
```json
{
  "name": "Electronics & Gadgets",
  "description": "Updated category description",
  "isActive": true
}
```

- `DELETE /api/Categories/{id}`
  - Path only, no body.

---

## Clients (`/api/Clients`)
- `GET /api/Clients/{userId}/profile`
  - Path only, no body.

- `PUT /api/Clients/{userId}/profile`
```json
{
  "identificationNumber": "0102030405",
  "firstName": "Jane",
  "lastName": "Doe",
  "birthDate": "1995-07-10",
  "phone": "+593999999999"
}
```

---

## Dashboard (`/api/Dashboard`)
- `GET /api/Dashboard/summary?startDate=2025-01-01&endDate=2025-01-31`
  - Query only, no body.

---

## Inventory (`/api/Inventory`)
- `POST /api/Inventory/movements`
```json
{
  "productId": "33333333-3333-3333-3333-333333333333",
  "movementType": "MANUAL_ADJUSTMENT",
  "quantity": 10,
  "referenceOrderId": null
}
```

- `GET /api/Inventory/movements/product/{productId}`
  - Path only, no body.

- `GET /api/Inventory/low-stock`
  - No params/body.

---

## Notifications (`/api/Notifications`)
- `GET /api/Notifications/pending`
  - No params/body.

- `POST /api/Notifications`
```json
{
  "userId": "11111111-1111-1111-1111-111111111111",
  "orderId": "66666666-6666-6666-6666-666666666666",
  "type": "ORDER_CONFIRMATION",
  "recipientEmail": "user@example.com",
  "subject": "Your order has been created"
}
```

- `PATCH /api/Notifications/{id}/sent`
  - Path only, no body.

- `PATCH /api/Notifications/{id}/failed`
  - Path only, no body.

---

## Orders (`/api/Orders`)
- `POST /api/Orders/from-cart/{cartId}`
```json
{
  "paymentMethod": "CREDIT_CARD",
  "shippingAddress": "123 Main St, City, Country"
}
```

- `GET /api/Orders/{orderId}`
  - Path only, no body.

- `GET /api/Orders/user/{userId}`
  - Path only, no body.

- `GET /api/Orders/{orderId}/detail`
  - Path only, no body.

- `PATCH /api/Orders/{orderId}/status`
```json
{
  "status": "SHIPPED"
}
```

- `POST /api/Orders/{orderId}/cancel`
  - Path only, no body.

---

## Product Images
- `GET /api/products/{productId}/images`
  - Path only, no body.

- `POST /api/products/{productId}/images` (`multipart/form-data`)
  - `file`: *(select image file)*
  - `isMain`: `true`
  - `altText`: `Front view`
  - `sortOrder`: `0`

- `PUT /api/product-images/{id}` (`multipart/form-data`)
  - `file`: *(optional image file)*
  - `isMain`: `false`
  - `altText`: `Updated alt text`
  - `sortOrder`: `1`

- `DELETE /api/product-images/{id}`
  - Path only, no body.

- `PATCH /api/product-images/{id}/main`
  - Path only, no body.

---

## Products (`/api/Products`)
- `GET /api/Products?search=phone&categoryId=22222222-2222-2222-2222-222222222222&includeInactive=false`
  - Query only, no body.

- `GET /api/Products/{id}`
  - Path only, no body.

- `POST /api/Products`
```json
{
  "categoryId": "22222222-2222-2222-2222-222222222222",
  "name": "Smartphone X",
  "description": "Flagship model",
  "price": 799.99,
  "stockQuantity": 25,
  "minimumStock": 5
}
```

- `PUT /api/Products/{id}`
```json
{
  "categoryId": "22222222-2222-2222-2222-222222222222",
  "name": "Smartphone X Pro",
  "description": "Updated model",
  "price": 899.99,
  "stockQuantity": 20,
  "minimumStock": 5,
  "isActive": true
}
```

- `DELETE /api/Products/{id}`
  - Path only, no body.

---

## Promotions (`/api/Promotions`)
- `GET /api/Promotions/active`
  - No params/body.

- `POST /api/Promotions`
```json
{
  "name": "Summer Sale",
  "description": "Seasonal discount",
  "discountPercentage": 15.5,
  "startDate": "2025-06-01",
  "endDate": "2025-06-30"
}
```

- `PUT /api/Promotions/{id}`
```json
{
  "name": "Summer Sale Extended",
  "description": "Extended seasonal discount",
  "discountPercentage": 18.0,
  "startDate": "2025-06-01",
  "endDate": "2025-07-15",
  "isActive": true
}
```

- `POST /api/Promotions/{promotionId}/products/{productId}`
  - Path only, no body.

- `DELETE /api/Promotions/{promotionId}/products/{productId}`
  - Path only, no body.

---

## Reports (`/api/Reports`)
- `GET /api/Reports/sales-by-period?startDate=2025-01-01&endDate=2025-01-31`
  - Query only, no body.

- `GET /api/Reports/sales-by-product?startDate=2025-01-01&endDate=2025-01-31`
  - Query only, no body.

- `GET /api/Reports/top-products?startDate=2025-01-01&endDate=2025-01-31&top=5`
  - Query only, no body.

---

## Reviews (`/api/Reviews`)
- `GET /api/Reviews/product/{productId}`
  - Path only, no body.

- `GET /api/Reviews/user/{userId}`
  - Path only, no body.

- `POST /api/Reviews`
```json
{
  "userId": "11111111-1111-1111-1111-111111111111",
  "productId": "33333333-3333-3333-3333-333333333333",
  "orderId": "66666666-6666-6666-6666-666666666666",
  "rating": 5,
  "comment": "Great product"
}
```

---

## Wishlist (`/api/Wishlist`)
- `GET /api/Wishlist/user/{userId}`
  - Path only, no body.

- `POST /api/Wishlist/user/{userId}`
```json
{
  "productId": "33333333-3333-3333-3333-333333333333"
}
```

- `DELETE /api/Wishlist/user/{userId}/product/{productId}`
  - Path only, no body.

- `POST /api/Wishlist/user/{userId}/toggle`
```json
{
  "productId": "33333333-3333-3333-3333-333333333333"
}
```
