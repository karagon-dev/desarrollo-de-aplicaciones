namespace Skama.Api.Models
{
    public class PromotionProduct : ModelBase
    {
        public Guid PromotionId { get; set; }
        public Guid ProductId { get; set; }
    }
}
