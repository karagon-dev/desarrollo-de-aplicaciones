using SKAMAJewelry.Web.Contracts.Api;

namespace SKAMAJewelry.Web.Services.Api;

public sealed class SkamaApiDataStore
{
    public static readonly Guid CustomerUserId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afa6");
    public static readonly Guid AdminUserId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    public static readonly Guid AnillosCategoryId = Guid.Parse("d4e5f6a7-b8c9-0123-def0-234567890123");
    public static readonly Guid CollaresCategoryId = Guid.Parse("22222222-2222-2222-2222-222222222222");
    public static readonly Guid AretesCategoryId = Guid.Parse("33333333-3333-3333-3333-333333333333");
    public static readonly Guid AuroraProductId = Guid.Parse("c3d4e5f6-a7b8-9012-cdef-123456789012");
    public static readonly Guid SelvaProductId = Guid.Parse("44444444-4444-4444-4444-444444444444");
    public static readonly Guid CartId = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890");
    public static readonly Guid OrderId = Guid.Parse("b8c9d0e1-f2a3-4567-1234-678901234567");

    public object SyncRoot { get; } = new();

    public List<UserRecord> Users { get; } = [];
    public List<PasswordResetRecord> PasswordResets { get; } = [];
    public List<CategoryRecord> Categories { get; } = [];
    public List<ProductRecord> Products { get; } = [];
    public List<ProductImageRecord> ProductImages { get; } = [];
    public List<ClientProfileRecord> ClientProfiles { get; } = [];
    public List<CartRecord> Carts { get; } = [];
    public List<CartItemRecord> CartItems { get; } = [];
    public List<OrderRecord> Orders { get; } = [];
    public List<OrderItemRecord> OrderItems { get; } = [];
    public List<InventoryMovementRecord> InventoryMovements { get; } = [];
    public List<NotificationRecord> Notifications { get; } = [];
    public List<PromotionRecord> Promotions { get; } = [];
    public List<PromotionProductRecord> PromotionProducts { get; } = [];
    public List<ReviewRecord> Reviews { get; } = [];
    public List<WishlistItemRecord> WishlistItems { get; } = [];

    public SkamaApiDataStore()
    {
        var now = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);

        Users.AddRange(
        [
            new UserRecord
            {
                Id = CustomerUserId,
                RoleId = 2,
                RoleName = "Customer",
                Email = "cliente@ejemplo.com",
                Password = "MiClave123",
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 15, 10, 30, 0, DateTimeKind.Utc)
            },
            new UserRecord
            {
                Id = AdminUserId,
                RoleId = 1,
                RoleName = "Admin",
                Email = "admin@skama.local",
                Password = "Admin123",
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 1, 9, 0, 0, DateTimeKind.Utc)
            }
        ]);

        Categories.AddRange(
        [
            new CategoryRecord
            {
                Id = AnillosCategoryId,
                Name = "Anillos",
                Description = "Anillos con esmeralda",
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new CategoryRecord
            {
                Id = CollaresCategoryId,
                Name = "Collares",
                Description = "Collares con esmeralda colombiana",
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 2, 0, 0, 0, DateTimeKind.Utc)
            },
            new CategoryRecord
            {
                Id = AretesCategoryId,
                Name = "Aretes",
                Description = "Aretes de lujo contemporaneo",
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 3, 0, 0, 0, DateTimeKind.Utc)
            }
        ]);

        Products.AddRange(
        [
            new ProductRecord
            {
                Id = AuroraProductId,
                CategoryId = AnillosCategoryId,
                Name = "Anillo Aurora Esmeralda",
                Description = "Anillo en oro con esmeralda colombiana",
                Price = 185000m,
                StockQuantity = 10,
                MinimumStock = 3,
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new ProductRecord
            {
                Id = SelvaProductId,
                CategoryId = CollaresCategoryId,
                Name = "Collar Selva Dorada",
                Description = "Collar de presencia editorial",
                Price = 240000m,
                StockQuantity = 4,
                MinimumStock = 2,
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 8, 0, 0, 0, DateTimeKind.Utc)
            },
            new ProductRecord
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                CategoryId = AretesCategoryId,
                Name = "Aretes Luz de Jade",
                Description = "Aretes con acabado refinado",
                Price = 132000m,
                StockQuantity = 2,
                MinimumStock = 5,
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 12, 0, 0, 0, DateTimeKind.Utc)
            }
        ]);

        ProductImages.AddRange(
        [
            new ProductImageRecord
            {
                Id = Guid.Parse("d0e1f2a3-b4c5-6789-3456-890123456789"),
                ProductId = AuroraProductId,
                ImageName = "aurora-esmeralda.webp",
                ImageUrl = "/images/products/aurora-esmeralda.webp",
                IsMain = true,
                AltText = "Anillo Aurora Esmeralda",
                SortOrder = 0,
                CreatedAt = now
            }
        ]);

        ClientProfiles.Add(new ClientProfileRecord
        {
            Id = Guid.Parse("e5f6a7b8-c9d0-1234-ef01-345678901234"),
            UserId = CustomerUserId,
            IdentificationNumber = "1234567890",
            FirstName = "Maria",
            LastName = "Garcia",
            BirthDate = new DateOnly(1990, 5, 20),
            Phone = "+573001234567",
            CreatedAt = new DateTime(2026, 1, 10, 12, 0, 0, DateTimeKind.Utc)
        });

        Carts.Add(new CartRecord
        {
            Id = CartId,
            UserId = CustomerUserId,
            Status = "ACTIVE",
            CreatedAt = new DateTime(2026, 3, 1, 8, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2026, 3, 1, 9, 15, 0, DateTimeKind.Utc)
        });

        CartItems.Add(new CartItemRecord
        {
            Id = Guid.Parse("b2c3d4e5-f6a7-8901-bcde-f12345678901"),
            CartId = CartId,
            ProductId = AuroraProductId,
            Quantity = 1,
            UnitPrice = 185000m,
            CreatedAt = now
        });

        Orders.Add(new OrderRecord
        {
            Id = OrderId,
            UserId = CustomerUserId,
            OrderNumber = "ORD-20260301-001",
            Status = "PAID",
            PaymentMethod = "CREDIT_CARD",
            ShippingAddress = "Calle 123 #45-67, Bogota",
            Subtotal = 185000m,
            DiscountTotal = 0m,
            Total = 185000m,
            CreatedAt = new DateTime(2026, 3, 1, 11, 0, 0, DateTimeKind.Utc)
        });

        OrderItems.Add(new OrderItemRecord
        {
            Id = Guid.Parse("c9d0e1f2-a3b4-5678-2345-789012345678"),
            OrderId = OrderId,
            ProductId = AuroraProductId,
            ProductName = "Anillo Aurora Esmeralda",
            Quantity = 1,
            UnitPrice = 185000m,
            DiscountAmount = 0m,
            LineTotal = 185000m
        });

        InventoryMovements.Add(new InventoryMovementRecord
        {
            Id = Guid.Parse("f6a7b8c9-d0e1-2345-f012-456789012345"),
            ProductId = AuroraProductId,
            MovementType = "MANUAL_ADJUSTMENT",
            Quantity = 10,
            PreviousStock = 0,
            NewStock = 10,
            ReferenceOrderId = null,
            CreatedAt = new DateTime(2026, 3, 1, 14, 0, 0, DateTimeKind.Utc)
        });

        Notifications.Add(new NotificationRecord
        {
            Id = Guid.Parse("a7b8c9d0-e1f2-3456-0123-567890123456"),
            UserId = CustomerUserId,
            OrderId = OrderId,
            Type = "ORDER_CONFIRMATION",
            RecipientEmail = "cliente@ejemplo.com",
            Subject = "Confirmacion de pedido #ORD-001",
            Status = "PENDING",
            CreatedAt = new DateTime(2026, 3, 1, 10, 0, 0, DateTimeKind.Utc)
        });

        Promotions.Add(new PromotionRecord
        {
            Id = Guid.Parse("e1f2a3b4-c5d6-7890-4567-901234567890"),
            Name = "Descuento Primavera",
            Description = "15% en anillos",
            DiscountPercentage = 15m,
            StartDate = new DateOnly(2026, 3, 1),
            EndDate = new DateOnly(2026, 12, 31),
            IsActive = true,
            CreatedAt = new DateTime(2026, 2, 20, 0, 0, 0, DateTimeKind.Utc)
        });

        PromotionProducts.Add(new PromotionProductRecord
        {
            PromotionId = Guid.Parse("e1f2a3b4-c5d6-7890-4567-901234567890"),
            ProductId = AuroraProductId
        });

        Reviews.Add(new ReviewRecord
        {
            Id = Guid.Parse("f2a3b4c5-d6e7-8901-5678-012345678901"),
            UserId = CustomerUserId,
            ProductId = AuroraProductId,
            OrderId = OrderId,
            Rating = 5,
            Comment = "Excelente calidad",
            CreatedAt = new DateTime(2026, 2, 15, 16, 0, 0, DateTimeKind.Utc)
        });

        WishlistItems.Add(new WishlistItemRecord
        {
            Id = Guid.Parse("a3b4c5d6-e7f8-9012-6789-123456789012"),
            UserId = CustomerUserId,
            ProductId = AuroraProductId,
            CreatedAt = new DateTime(2026, 3, 1, 12, 0, 0, DateTimeKind.Utc)
        });
    }

    public ProductDto ToProductDto(ProductRecord product)
    {
        var category = Categories.FirstOrDefault(item => item.Id == product.CategoryId);
        return new ProductDto(
            product.Id,
            product.CategoryId,
            category?.Name ?? string.Empty,
            product.Name,
            product.Description,
            product.Price,
            product.StockQuantity,
            product.MinimumStock,
            product.IsActive,
            product.CreatedAt,
            product.UpdatedAt);
    }

    public CategoryDto ToCategoryDto(CategoryRecord category) =>
        new(category.Id, category.Name, category.Description, category.IsActive, category.CreatedAt, category.UpdatedAt);

    public UserDto ToUserDto(UserRecord user) =>
        new(user.Id, user.RoleId, user.RoleName, user.Email, user.IsActive, user.CreatedAt, user.UpdatedAt);

    public ClientProfileDto ToClientProfileDto(ClientProfileRecord profile) =>
        new(profile.Id, profile.UserId, profile.IdentificationNumber, profile.FirstName, profile.LastName, profile.BirthDate, profile.Phone, profile.CreatedAt, profile.UpdatedAt);

    public CartDto ToCartDto(CartRecord cart) =>
        new(cart.Id, cart.UserId, cart.Status, cart.CreatedAt, cart.UpdatedAt);

    public CartDetailDto ToCartDetailDto(CartRecord cart)
    {
        var items = CartItems
            .Where(item => item.CartId == cart.Id)
            .Select(ToCartItemDto)
            .ToArray();

        return new CartDetailDto(cart.Id, cart.UserId, cart.Status, cart.CreatedAt, cart.UpdatedAt, items.Sum(item => item.Subtotal), items);
    }

    public CartItemDto ToCartItemDto(CartItemRecord item)
    {
        var product = Products.First(product => product.Id == item.ProductId);
        return new CartItemDto(item.Id, product.Id, product.Name, item.Quantity, item.UnitPrice, item.UnitPrice * item.Quantity, product.StockQuantity, product.IsActive);
    }

    public OrderDto ToOrderDto(OrderRecord order) =>
        new(order.Id, order.UserId, order.OrderNumber, order.Status, order.PaymentMethod, order.ShippingAddress, order.Subtotal, order.DiscountTotal, order.Total, order.CreatedAt, order.UpdatedAt);

    public OrderDetailDto ToOrderDetailDto(OrderRecord order)
    {
        var items = OrderItems
            .Where(item => item.OrderId == order.Id)
            .Select(ToOrderItemDto)
            .ToArray();

        return new OrderDetailDto(order.Id, order.UserId, order.OrderNumber, order.Status, order.PaymentMethod, order.ShippingAddress, order.Subtotal, order.DiscountTotal, order.Total, order.CreatedAt, order.UpdatedAt, items);
    }

    public OrderItemDto ToOrderItemDto(OrderItemRecord item) =>
        new(item.Id, item.OrderId, item.ProductId, item.ProductName, item.Quantity, item.UnitPrice, item.DiscountAmount, item.LineTotal);

    public ProductImageDto ToProductImageDto(ProductImageRecord image) =>
        new(image.Id, image.ProductId, image.ImageName, image.ImageUrl, image.IsMain, image.CreatedAt);

    public InventoryMovementDto ToInventoryMovementDto(InventoryMovementRecord movement) =>
        new(movement.Id, movement.ProductId, movement.MovementType, movement.Quantity, movement.PreviousStock, movement.NewStock, movement.ReferenceOrderId, movement.CreatedAt);

    public NotificationDto ToNotificationDto(NotificationRecord notification) =>
        new(notification.Id, notification.UserId, notification.OrderId, notification.Type, notification.RecipientEmail, notification.Subject, notification.Status, notification.SentAt, notification.CreatedAt);

    public PromotionDto ToPromotionDto(PromotionRecord promotion) =>
        new(promotion.Id, promotion.Name, promotion.Description, promotion.DiscountPercentage, promotion.StartDate, promotion.EndDate, promotion.IsActive, promotion.CreatedAt, promotion.UpdatedAt);

    public ReviewDto ToReviewDto(ReviewRecord review) =>
        new(review.Id, review.UserId, review.ProductId, review.OrderId, review.Rating, review.Comment, review.CreatedAt);

    public WishlistItemDto ToWishlistItemDto(WishlistItemRecord item)
    {
        var product = Products.First(product => product.Id == item.ProductId);
        return new WishlistItemDto(item.Id, item.UserId, product.Id, product.Name, product.Price, product.StockQuantity, product.IsActive, item.CreatedAt);
    }
}

public sealed class UserRecord
{
    public Guid Id { get; set; }
    public int RoleId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public sealed class PasswordResetRecord
{
    public string Token { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public DateTime ExpiresAt { get; set; }
}

public sealed class CategoryRecord
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public sealed class ProductRecord
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public int MinimumStock { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public sealed class ProductImageRecord
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ImageName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsMain { get; set; }
    public string? AltText { get; set; }
    public int SortOrder { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public sealed class ClientProfileRecord
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string IdentificationNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateOnly BirthDate { get; set; }
    public string Phone { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public sealed class CartRecord
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Status { get; set; } = "ACTIVE";
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public sealed class CartItemRecord
{
    public Guid Id { get; set; }
    public Guid CartId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public DateTime CreatedAt { get; set; }
}

public sealed class OrderRecord
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal DiscountTotal { get; set; }
    public decimal Total { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public sealed class OrderItemRecord
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal LineTotal { get; set; }
}

public sealed class InventoryMovementRecord
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string MovementType { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int PreviousStock { get; set; }
    public int NewStock { get; set; }
    public Guid? ReferenceOrderId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public sealed class NotificationRecord
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid? OrderId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Status { get; set; } = "PENDING";
    public DateTime? SentAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public sealed class PromotionRecord
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal DiscountPercentage { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public sealed class PromotionProductRecord
{
    public Guid PromotionId { get; set; }
    public Guid ProductId { get; set; }
}

public sealed class ReviewRecord
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public Guid OrderId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}

public sealed class WishlistItemRecord
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public DateTime CreatedAt { get; set; }
}
