using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<(Guid OrderId, string OrderNumber, bool Success, int ResultCode, string? Error)> CreateFromCartAsync(
        Guid cartId, CreateOrderFromCartRequest request)
    {
        var (orderId, orderNumber, resultCode) = await _orderRepository.CreateFromCartAsync(
            cartId, request.PaymentMethod, request.ShippingAddress);

        return resultCode switch
        {
            0 => (orderId, orderNumber, true, resultCode, null),
            2 => (Guid.Empty, string.Empty, false, resultCode, "The cart is empty or a validation error occurred."),
            22 => (Guid.Empty, string.Empty, false, resultCode, "Not enough stock available."),
            31 => (Guid.Empty, string.Empty, false, resultCode, "Cart is not active."),
            _ => (Guid.Empty, string.Empty, false, resultCode, "An unexpected error occurred.")
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

        return resultCode switch
        {
            0 => (true, resultCode, null),
            2 => (false, resultCode, "Invalid order status."),
            40 => (false, resultCode, "Order was not found."),
            _ => (false, resultCode, "An unexpected error occurred.")
        };
    }

    public async Task<(bool Success, int ResultCode, string? Error)> CancelAsync(Guid orderId)
    {
        var (_, resultCode) = await _orderRepository.CancelAsync(orderId);

        return resultCode switch
        {
            0 => (true, resultCode, null),
            40 => (false, resultCode, "Order was not found."),
            41 => (false, resultCode, "Order already processed."),
            _ => (false, resultCode, "An unexpected error occurred.")
        };
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
