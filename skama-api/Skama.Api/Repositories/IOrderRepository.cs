using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface IOrderRepository
{
    Task<(Guid OrderId, string OrderNumber, int ResultCode)> CreateFromCartAsync(
        Guid cartId, string paymentMethod, string shippingAddress);
    Task<Order?> GetByIdAsync(Guid orderId);
    Task<IEnumerable<Order>> GetByUserIdAsync(Guid userId);
    Task<OrderDetail?> GetDetailAsync(Guid orderId);
    Task<(int RowsAffected, int ResultCode)> UpdateStatusAsync(Guid orderId, string status);
    Task<(int RowsAffected, int ResultCode)> CancelAsync(Guid orderId);
}
