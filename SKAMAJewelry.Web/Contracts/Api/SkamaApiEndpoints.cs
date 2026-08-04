namespace SKAMAJewelry.Web.Contracts.Api;

public sealed record ApiEndpointDescriptor(string Module, string Method, string Template);

public static class SkamaApiEndpoints
{
    public const int ExpectedCount = 59;

    public static IReadOnlyList<ApiEndpointDescriptor> All { get; } =
    [
        new("Auth", "POST", "/api/auth/register"),
        new("Auth", "POST", "/api/auth/login"),
        new("Auth", "GET", "/api/auth/users/{id}"),
        new("Auth", "GET", "/api/auth/users/by-email/{email}"),
        new("Auth", "PATCH", "/api/auth/users/{id}/status"),
        new("Auth", "POST", "/api/auth/forgot-password"),
        new("Auth", "POST", "/api/auth/reset-password"),

        new("Cart", "POST", "/api/cart/user/{userId}"),
        new("Cart", "GET", "/api/cart/user/{userId}"),
        new("Cart", "GET", "/api/cart/{cartId}"),
        new("Cart", "POST", "/api/cart/{cartId}/items"),
        new("Cart", "PUT", "/api/cart/items/{cartItemId}"),
        new("Cart", "DELETE", "/api/cart/items/{cartItemId}"),

        new("Categories", "GET", "/api/categories"),
        new("Categories", "GET", "/api/categories/{id}"),
        new("Categories", "POST", "/api/categories"),
        new("Categories", "PUT", "/api/categories/{id}"),
        new("Categories", "DELETE", "/api/categories/{id}"),

        new("Clients", "GET", "/api/clients/{userId}/profile"),
        new("Clients", "PUT", "/api/clients/{userId}/profile"),

        new("Dashboard", "GET", "/api/dashboard/summary"),

        new("Inventory", "POST", "/api/inventory/movements"),
        new("Inventory", "GET", "/api/inventory/movements/product/{productId}"),
        new("Inventory", "GET", "/api/inventory/low-stock"),

        new("Notifications", "GET", "/api/notifications/pending"),
        new("Notifications", "POST", "/api/notifications"),
        new("Notifications", "PATCH", "/api/notifications/{id}/sent"),
        new("Notifications", "PATCH", "/api/notifications/{id}/failed"),

        new("Orders", "POST", "/api/orders/from-cart/{cartId}"),
        new("Orders", "GET", "/api/orders/{orderId}"),
        new("Orders", "GET", "/api/orders/user/{userId}"),
        new("Orders", "GET", "/api/orders/{orderId}/detail"),
        new("Orders", "PATCH", "/api/orders/{orderId}/status"),
        new("Orders", "POST", "/api/orders/{orderId}/cancel"),

        new("Product Images", "GET", "/api/products/{productId}/images"),
        new("Product Images", "POST", "/api/products/{productId}/images"),
        new("Product Images", "PUT", "/api/product-images/{id}"),
        new("Product Images", "DELETE", "/api/product-images/{id}"),
        new("Product Images", "PATCH", "/api/product-images/{id}/main"),

        new("Products", "GET", "/api/products"),
        new("Products", "GET", "/api/products/{id}"),
        new("Products", "POST", "/api/products"),
        new("Products", "PUT", "/api/products/{id}"),
        new("Products", "DELETE", "/api/products/{id}"),

        new("Promotions", "GET", "/api/promotions/active"),
        new("Promotions", "POST", "/api/promotions"),
        new("Promotions", "PUT", "/api/promotions/{id}"),
        new("Promotions", "POST", "/api/promotions/{promotionId}/products/{productId}"),
        new("Promotions", "DELETE", "/api/promotions/{promotionId}/products/{productId}"),

        new("Reports", "GET", "/api/reports/sales-by-period"),
        new("Reports", "GET", "/api/reports/sales-by-product"),
        new("Reports", "GET", "/api/reports/top-products"),

        new("Reviews", "GET", "/api/reviews/product/{productId}"),
        new("Reviews", "GET", "/api/reviews/user/{userId}"),
        new("Reviews", "POST", "/api/reviews"),

        new("Wishlist", "GET", "/api/wishlist/user/{userId}"),
        new("Wishlist", "POST", "/api/wishlist/user/{userId}"),
        new("Wishlist", "DELETE", "/api/wishlist/user/{userId}/product/{productId}"),
        new("Wishlist", "POST", "/api/wishlist/user/{userId}/toggle")
    ];
}
