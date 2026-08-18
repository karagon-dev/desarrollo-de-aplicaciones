using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;
using System.Text.Json;

namespace Skama.Api.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IAuthRepository _authRepository;
    private readonly INotificationService _notificationService;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IOrderRepository orderRepository,
        IAuthRepository authRepository,
        INotificationService notificationService,
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository;
        _authRepository = authRepository;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task<(Guid OrderId, string OrderNumber, bool Success, int ResultCode, string? Error)> CreateFromCartAsync(
        Guid cartId, CreateOrderFromCartRequest request)
    {
        var productRatings = request.ProductRatings ?? [];
        var productRatingsJson = productRatings.Count > 0
            ? JsonSerializer.Serialize(productRatings)
            : null;

        var (orderId, orderNumber, resultCode) = await _orderRepository.CreateFromCartAsync(
            cartId, request.PaymentMethod, request.ShippingAddress, productRatingsJson);

        if (resultCode == 0)
        {
            await NotifyOrderAsync(orderId, isConfirmation: true);
            return (orderId, orderNumber, true, resultCode, null);
        }

        return resultCode switch
        {
            2 => (Guid.Empty, string.Empty, false, resultCode, "El carrito está vacío u ocurrió un error de validación."),
            22 => (Guid.Empty, string.Empty, false, resultCode, "No hay unidades suficientes para completar la orden."),
            31 => (Guid.Empty, string.Empty, false, resultCode, "El carrito no está activo."),
            _ => (Guid.Empty, string.Empty, false, resultCode, "Ocurrió un error inesperado.")
        };
    }

    public async Task<OrderDto?> GetByIdAsync(Guid orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        return order is null ? null : MapToDto(order);
    }

    public async Task<IEnumerable<OrderDto>> GetByUserIdAsync(Guid userId)
    {
        var orders = await _orderRepository.GetByUserIdAsync(userId);
        return orders.Select(MapToDto);
    }

    public async Task<OrderDetailDto?> GetDetailAsync(Guid orderId)
    {
        var detail = await _orderRepository.GetDetailAsync(orderId);
        return detail is null ? null : MapToDetailDto(detail);
    }

    public async Task<(bool Success, int ResultCode, string? Error)> UpdateStatusAsync(
        Guid orderId, UpdateOrderStatusRequest request)
    {
        var (_, resultCode) = await _orderRepository.UpdateStatusAsync(orderId, request.Status);

        if (resultCode == 0)
        {
            await NotifyOrderAsync(orderId, isConfirmation: false);
            return (true, resultCode, null);
        }

        return resultCode switch
        {
            2 => (false, resultCode, "Estado de orden inválido."),
            40 => (false, resultCode, "Orden no encontrada."),
            _ => (false, resultCode, "Ocurrió un error inesperado.")
        };
    }

    public async Task<(bool Success, int ResultCode, string? Error)> CancelAsync(Guid orderId)
    {
        var (_, resultCode) = await _orderRepository.CancelAsync(orderId);

        if (resultCode == 0)
        {
            await NotifyOrderAsync(orderId, isConfirmation: false);
            return (true, resultCode, null);
        }

        return resultCode switch
        {
            40 => (false, resultCode, "Orden no encontrada."),
            41 => (false, resultCode, "La orden ya fue procesada."),
            _ => (false, resultCode, "Ocurrió un error inesperado.")
        };
    }

    private async Task NotifyOrderAsync(Guid orderId, bool isConfirmation)
    {
        try
        {
            var order = await GetDetailAsync(orderId);
            if (order is null)
            {
                _logger.LogWarning("No se encontró el pedido {OrderId} para notificar por correo.", orderId);
                return;
            }

            var user = await _authRepository.GetByIdAsync(order.UserId);
            if (user is null || string.IsNullOrWhiteSpace(user.Email))
            {
                _logger.LogWarning("No se encontró el correo del usuario {UserId} para el pedido {OrderId}.", order.UserId, orderId);
                return;
            }

            if (isConfirmation)
            {
                await _notificationService.NotifyOrderConfirmationAsync(order, user.Email);
                return;
            }

            await _notificationService.NotifyOrderStatusUpdateAsync(order, user.Email);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "No se pudo enviar la notificación de correo del pedido {OrderId}.", orderId);
        }
    }

    private static OrderDto MapToDto(Order order) => new()
    {
        Id = order.Id,
        UserId = order.UserId,
        OrderNumber = order.OrderNumber,
        Status = order.Status,
        PaymentMethod = order.PaymentMethod,
        ShippingAddress = order.ShippingAddress,
        Subtotal = order.Subtotal,
        DiscountTotal = order.DiscountTotal,
        Total = order.Total,
        CreatedAt = order.CreatedAt,
        UpdatedAt = order.UpdatedAt
    };

    private static OrderDetailDto MapToDetailDto(OrderDetail detail) => new()
    {
        Id = detail.Id,
        UserId = detail.UserId,
        OrderNumber = detail.OrderNumber,
        Status = detail.Status,
        PaymentMethod = detail.PaymentMethod,
        ShippingAddress = detail.ShippingAddress,
        Subtotal = detail.Subtotal,
        DiscountTotal = detail.DiscountTotal,
        Total = detail.Total,
        CreatedAt = detail.CreatedAt,
        UpdatedAt = detail.UpdatedAt,
        Items = detail.Items.Select(item => new OrderItemDto
        {
            Id = item.Id,
            OrderId = item.OrderId,
            ProductId = item.ProductId,
            ProductName = item.ProductName,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            DiscountAmount = item.DiscountAmount,
            LineTotal = item.LineTotal
        }).ToList()
    };
}
