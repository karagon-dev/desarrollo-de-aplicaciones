using Skama.Api.Models;

public interface IProductRepository
{
	Task<Guid> AddAsync(Product product);
}