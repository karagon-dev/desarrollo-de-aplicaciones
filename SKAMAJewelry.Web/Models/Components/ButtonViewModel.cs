namespace SKAMAJewelry.Web.Models.Components;

public sealed record ButtonViewModel(
    string Label,
    string Variant = "primary",
    string Size = "md",
    string? Href = null,
    string? IconName = null,
    string Type = "button",
    bool Disabled = false,
    string? DrawerTarget = null,
    bool ClosesDrawer = false);

public sealed record IconButtonViewModel(
    string Label,
    string IconName,
    string Size = "md",
    string? Action = null);
