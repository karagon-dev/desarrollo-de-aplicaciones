using Azure.Identity;
using Microsoft.Extensions.Configuration;

namespace Skama.Api;

public static class AzureKeyVaultConfiguration
{
    public static WebApplicationBuilder AddAzureKeyVaultIfConfigured(this WebApplicationBuilder builder)
    {
        var vaultUri = builder.Configuration["KeyVault:VaultUri"];
        if (string.IsNullOrWhiteSpace(vaultUri))
        {
            return builder;
        }

        builder.Configuration.AddAzureKeyVault(new Uri(vaultUri), new DefaultAzureCredential());
        return builder;
    }
}
