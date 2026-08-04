namespace SKAMAJewelry.Web.Models.Components;

public sealed record ContainerViewModel(string Content, string Size = "lg");

public sealed record GridViewModel(string Content, string MinColumnWidth = "16rem", string Gap = "var(--space-5)");

public sealed record DividerViewModel(string Spacing = "md");

public sealed record SectionTitleViewModel(
    string Title,
    string? Kicker = null,
    string? Description = null);

public sealed record CardViewModel(
    string Title,
    string Description,
    string? Eyebrow = null);

public sealed record ProductCardViewModel(
    string Name,
    string Collection,
    PriceViewModel Price,
    string ImageUrl,
    string ImageAlt,
    string Href = "#",
    string? Badge = null,
    string? Category = null,
    string? Description = null,
    string? RatingLabel = null,
    decimal? OldPrice = null,
    string ActionLabel = "Ver detalle",
    bool IsFavorite = false,
    string BadgeTone = "accent",
    string? ActionDrawerTarget = null,
    int AvailableQuantity = 8,
    int? MaxPurchaseQuantity = null)
{
    public bool IsLimitedEdition =>
        string.Equals(Badge, "Limited Edition", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(BadgeTone, "limited", StringComparison.OrdinalIgnoreCase);

    public int PurchaseQuantityLimit =>
        Math.Max(1, Math.Min(AvailableQuantity, MaxPurchaseQuantity ?? AvailableQuantity));
}

public sealed record CollectionCardViewModel(
    string Title,
    string Kicker,
    string ImageUrl,
    string ImageAlt,
    string Href = "#");

public sealed record HeroSectionViewModel(
    string Title,
    string Description,
    string ImageUrl,
    string? Kicker = null);

public sealed record CarouselViewModel(
    string Label,
    IReadOnlyCollection<CarouselItemViewModel> Items);

public sealed record CarouselItemViewModel(
    string Title,
    string ImageUrl,
    string ImageAlt);

public sealed record OverlayViewModel(
    string Id,
    string Title,
    string Content);
