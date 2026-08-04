namespace SKAMAJewelry.Web.Configuration;

public sealed class FrontendPrototypeOptions
{
    public const string SectionName = "FrontendPrototype";

    public string BrandName { get; init; } = "SKAMA Jewelry";

    public string Country { get; init; } = "Costa Rica";

    public string DefaultTheme { get; init; } = "light";
}
