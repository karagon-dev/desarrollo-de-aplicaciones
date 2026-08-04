namespace SKAMAJewelry.Web.Models.Components;

public sealed record BadgeViewModel(string Label, string Tone = "neutral");

public sealed record PriceViewModel(decimal Amount, string Currency = "CRC");

public sealed record FeedbackViewModel(string Title, string Message, string Tone = "neutral");

public sealed record ProgressViewModel(string Label, int Value);

public sealed record SkeletonViewModel(string Width = "100%", string Height = "1rem", string Shape = "block");

public sealed record BreadcrumbViewModel(IReadOnlyCollection<BreadcrumbItemViewModel> Items);

public sealed record BreadcrumbItemViewModel(string Label, string? Href = null);
