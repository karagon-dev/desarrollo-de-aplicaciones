namespace SKAMAJewelry.Web.Models.Components;

public sealed record FieldViewModel(
    string Id,
    string Name,
    string Label,
    string Type = "text",
    string? Placeholder = null,
    string? Value = null,
    string? HelperText = null,
    bool Required = false)
{
    public string? HelperId => string.IsNullOrWhiteSpace(HelperText) ? null : $"{Id}-helper";
}

public sealed record TextareaViewModel(
    string Id,
    string Name,
    string Label,
    string? Placeholder = null,
    string? Value = null,
    int Rows = 4,
    bool Required = false);

public sealed record SelectViewModel(
    string Id,
    string Name,
    string Label,
    IReadOnlyCollection<SelectOptionViewModel> Options,
    bool Required = false);

public sealed record SelectOptionViewModel(string Label, string Value, bool Selected = false);

public sealed record ChoiceViewModel(
    string Id,
    string Name,
    string Label,
    string Type = "checkbox",
    string Value = "true",
    bool Checked = false);

public sealed record ToggleViewModel(
    string Id,
    string Name,
    string Label,
    bool Checked = false,
    string? Action = null);

public sealed record SearchBarViewModel(
    string Id = "site-search",
    string Name = "search",
    string Label = "Buscar",
    string Placeholder = "Buscar joyas, colecciones o materiales");

public sealed record QuantitySelectorViewModel(
    string Label = "Cantidad",
    int Value = 1,
    int Min = 1,
    int Max = 10);
