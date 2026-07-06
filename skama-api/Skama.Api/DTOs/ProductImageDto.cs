namespace Skama.Api.DTOs;

public class ProductImageDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ImageName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsMain { get; set; }
    public DateTime? CreatedAt { get; set; }
}
