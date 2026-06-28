namespace Skama.Api.Models
{
    public class WishlistItem : CreatedAtModelBase
    {
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
    }
}
