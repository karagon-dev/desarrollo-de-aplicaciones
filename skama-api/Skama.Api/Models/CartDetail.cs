namespace Skama.Api.Models
{
    public class CartDetail
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Status { get; set; } = "ACTIVE";
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<CartItemDetail> Items { get; set; } = new();
        public decimal Total { get; set; }
    }
}