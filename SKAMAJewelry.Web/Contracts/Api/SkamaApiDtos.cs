namespace SKAMAJewelry.Web.Contracts.Api;

public sealed record RegisterRequest(string Email, string Password, string ConfirmPassword);
public sealed record RegisterResponse(Guid UserId);
public sealed record LoginRequest(string Email, string Password);
public sealed record LoginResponse(Guid UserId, string Email, int RoleId, string RoleName, bool IsActive);
public sealed record UserDto(Guid Id, int RoleId, string RoleName, string Email, bool IsActive, DateTime CreatedAt, DateTime? UpdatedAt);
public sealed record UpdateUserStatusRequest(bool IsActive);
public sealed record ForgotPasswordRequest(string Email);
public sealed record ForgotPasswordResponse(string Message, string? ResetToken);
public sealed record ResetPasswordRequest(string Token, string NewPassword, string ConfirmPassword);

public sealed record CartIdResponse(Guid CartId);
public sealed record CartDto(Guid Id, Guid UserId, string Status, DateTime CreatedAt, DateTime? UpdatedAt);
public sealed record CartDetailDto(Guid Id, Guid UserId, string Status, DateTime CreatedAt, DateTime? UpdatedAt, decimal Total, IReadOnlyCollection<CartItemDto> Items);
public sealed record CartItemDto(Guid Id, Guid ProductId, string ProductName, int Quantity, decimal UnitPrice, decimal Subtotal, int StockQuantity, bool IsActive);
public sealed record AddCartItemRequest(Guid ProductId, int Quantity);
public sealed record CartItemIdResponse(Guid CartItemId);
public sealed record UpdateCartItemRequest(int Quantity);

public sealed record CategoryDto(Guid Id, string Name, string? Description, bool IsActive, DateTime CreatedAt, DateTime? UpdatedAt);
public sealed record CreateCategoryRequest(string Name, string? Description);
public sealed record CategoryIdResponse(Guid Id);
public sealed record UpdateCategoryRequest(string Name, string? Description, bool IsActive);

public sealed record ClientProfileDto(
    Guid Id,
    Guid UserId,
    string IdentificationNumber,
    string FirstName,
    string LastName,
    DateOnly BirthDate,
    string Phone,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public sealed record UpsertClientProfileRequest(
    string IdentificationNumber,
    string FirstName,
    string LastName,
    DateOnly BirthDate,
    string Phone);

public sealed record ClientProfileResponse(Guid ProfileId);

public sealed record DashboardSummaryDto(
    decimal TotalSales,
    int TotalOrders,
    decimal AverageOrderValue,
    int RegisteredCustomers,
    int LowStockProducts,
    IReadOnlyCollection<ProductSalesDto> TopProducts);

public sealed record ProductSalesDto(Guid ProductId, string ProductName, int TotalQuantitySold, decimal TotalSales);

public sealed record InventoryMovementRequest(Guid ProductId, string MovementType, int Quantity, Guid? ReferenceOrderId);
public sealed record InventoryMovementIdResponse(Guid Id);
public sealed record InventoryMovementDto(
    Guid Id,
    Guid ProductId,
    string MovementType,
    int Quantity,
    int PreviousStock,
    int NewStock,
    Guid? ReferenceOrderId,
    DateTime CreatedAt);

public sealed record LowStockProductDto(Guid Id, string Name, int StockQuantity, int MinimumStock, bool IsActive);

public sealed record NotificationDto(
    Guid Id,
    Guid UserId,
    Guid? OrderId,
    string Type,
    string RecipientEmail,
    string Subject,
    string Status,
    DateTime? SentAt,
    DateTime CreatedAt);

public sealed record CreateNotificationRequest(Guid UserId, Guid? OrderId, string Type, string RecipientEmail, string Subject);
public sealed record NotificationIdResponse(Guid Id);

public sealed record CreateOrderFromCartRequest(string PaymentMethod, string ShippingAddress);
public sealed record CreateOrderResponse(Guid OrderId, string OrderNumber);
public sealed record OrderDto(
    Guid Id,
    Guid UserId,
    string OrderNumber,
    string Status,
    string PaymentMethod,
    string ShippingAddress,
    decimal Subtotal,
    decimal DiscountTotal,
    decimal Total,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public sealed record OrderDetailDto(
    Guid Id,
    Guid UserId,
    string OrderNumber,
    string Status,
    string PaymentMethod,
    string ShippingAddress,
    decimal Subtotal,
    decimal DiscountTotal,
    decimal Total,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IReadOnlyCollection<OrderItemDto> Items);

public sealed record OrderItemDto(
    Guid Id,
    Guid OrderId,
    Guid ProductId,
    string ProductName,
    int Quantity,
    decimal UnitPrice,
    decimal DiscountAmount,
    decimal LineTotal);

public sealed record UpdateOrderStatusRequest(string Status);

public sealed record ProductImageDto(Guid Id, Guid ProductId, string ImageName, string ImageUrl, bool IsMain, DateTime? CreatedAt);

public sealed record ProductDto(
    Guid Id,
    Guid CategoryId,
    string CategoryName,
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    int MinimumStock,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public sealed record CreateProductRequest(
    Guid CategoryId,
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    int MinimumStock);

public sealed record ProductIdResponse(Guid Id);

public sealed record UpdateProductRequest(
    Guid CategoryId,
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    int MinimumStock,
    bool IsActive);

public sealed record PromotionDto(
    Guid Id,
    string Name,
    string? Description,
    decimal DiscountPercentage,
    DateOnly StartDate,
    DateOnly EndDate,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public sealed record CreatePromotionRequest(string Name, string? Description, decimal DiscountPercentage, DateOnly StartDate, DateOnly EndDate);
public sealed record UpdatePromotionRequest(string Name, string? Description, decimal DiscountPercentage, DateOnly StartDate, DateOnly EndDate, bool IsActive);

public sealed record SalesByPeriodDto(DateOnly SaleDate, int OrderCount, decimal Subtotal, decimal DiscountTotal, decimal Total);

public sealed record ReviewDto(Guid Id, Guid UserId, Guid ProductId, Guid OrderId, int Rating, string? Comment, DateTime CreatedAt);
public sealed record CreateReviewRequest(Guid UserId, Guid ProductId, Guid OrderId, int Rating, string? Comment);
public sealed record ReviewIdResponse(Guid ReviewId);

public sealed record WishlistItemDto(Guid Id, Guid UserId, Guid ProductId, string ProductName, decimal Price, int StockQuantity, bool IsActive, DateTime CreatedAt);
public sealed record WishlistProductRequest(Guid ProductId);
public sealed record WishlistItemResponse(Guid Id);
public sealed record ToggleWishlistResponse(bool IsFavorite);
