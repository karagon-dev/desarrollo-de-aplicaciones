using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface IOrderService
{
    Task<(Guid OrderId, string OrderNumber, bool Success, int ResultCode, string? Error)> CreateFromCartAsync(
        Guid cartId, CreateOrderFromCartRequest request);
    Task<OrderDto?> GetByIdAsync(Guid orderId);
    Task<IEnumerable<OrderDto>> GetByUserIdAsync(Guid userId);
    Task<OrderDetailDto?> GetDetailAsync(Guid orderId);
    Task<(bool Success, int ResultCode, string? Error)> UpdateStatusAsync(Guid orderId, UpdateOrderStatusRequest request);
    Task<(bool Success, int ResultCode, string? Error)> CancelAsync(Guid orderId);
}
