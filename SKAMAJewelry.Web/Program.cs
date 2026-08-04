using SKAMAJewelry.Web.Configuration;
using SKAMAJewelry.Web.Interfaces.Services;
using SKAMAJewelry.Web.Services.Api;
using SKAMAJewelry.Web.Services.Placeholders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.Configure<FrontendPrototypeOptions>(
    builder.Configuration.GetSection(FrontendPrototypeOptions.SectionName));
builder.Services.AddSingleton<SkamaApiDataStore>();
builder.Services.AddSingleton<IFrontendPrototypeService, FrontendPrototypeService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Foundation}/{action=Index}/{id?}");

app.Run();
