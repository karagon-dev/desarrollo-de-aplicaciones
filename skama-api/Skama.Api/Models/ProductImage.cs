namespace Skama.Api.Models
{
    public class ProductImage : ModelBase
    {
        public Guid ProductId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? AltText { get; set; }
        public bool IsMain { get; set; }
        public int SortOrder { get; set; }
    }
}
