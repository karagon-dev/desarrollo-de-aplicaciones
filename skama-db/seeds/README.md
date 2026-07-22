# SKAMA - Development Data Seeds

Run **after** creating tables and stored procedures.

## Quick Run

```bash
sqlcmd -S localhost -d SkamaDb -E -i SeedAll.sql
```

Or execute each file manually in the order listed below.

## Execution Order

| # | File | Table(s) |
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

All scripts are **idempotent** (`IF NOT EXISTS`) and can be executed multiple times.

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@skama.com` | `MiClave123` |
| Customer | `customer@example.com` | `MiClave123` |
| Customer | `maria.garcia@skama.com` | `MiClave123` |

## Included Data

### Catalog

- **4 categories**: Rings, Necklaces, Earrings, Bracelets
- **6 products** with COP prices
- **2 low-stock products** for the dashboard: Premium Emerald Necklace (2/5), Emerald Solitaire Ring (1/2)
- **6 product images** with reference URLs; upload real files through admin if previews are needed

### Promotions

- **Spring Discount** (15%) on selected rings and necklaces
- **Welcome to SKAMA** (10%) on bracelets

### Orders

| Number | Customer | Status | Use |
|--------|----------|--------|-----|
| ORD-20260215-001 | customer@example.com | DELIVERED | Review + reports |
| ORD-20260301-001 | customer@example.com | SHIPPED | History |
| ORD-20260310-001 | customer@example.com | PAID | Pending notification |
| ORD-20260320-001 | customer@example.com | CANCELLED | Cancellation |
| ORD-20260401-001 | maria.garcia@skama.com | DELIVERED | Review + second customer |

### Active Carts

- `customer@example.com`: Emerald Solitaire Ring x 1
- `maria.garcia@skama.com`: Emerald Drop Earrings x 2

### Favorites, Reviews, Inventory

- **3 wishlist items**
- **2 published reviews** (one per customer)
- **6 inventory movements** (adjustments, sales, return)
- **4 email notifications** (SENT, FAILED, PENDING)
- **1 used reset token** for historical data

### Profiles

- Complete profile for `customer@example.com` and `maria.garcia@skama.com`

## Testing Dashboard And Reports

Use date range **2026-01-01** to **2026-06-30** in the admin panel to view sales and top products with real data.

## Password Reset

Valid tokens are generated through the API:

```http
POST /api/auth/forgot-password
{ "email": "customer@example.com" }
```

In development, the response includes `resetToken` for use in `POST /api/auth/reset-password`.
