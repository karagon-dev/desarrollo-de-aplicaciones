public interface IProductRepository
{
	Task<Guid> AddAsync(Product product);
}