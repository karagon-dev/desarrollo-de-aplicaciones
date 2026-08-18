# SKAMA Jewelry

E-commerce de joyería en esmeralda. Arquitectura en tres capas:

- `skama-webapp` — frontend React + TypeScript + Vite
- `skama-api` — API ASP.NET Core (.NET 9) con Dapper y stored procedures
- `skama-db` — esquema SQL Server (tablas, SPs y seeds)

## Requisitos

- Node.js LTS con `npm`
- SDK de .NET 9
- SQL Server (LocalDB, Express o Developer)
- `sqlcmd` (opcional, para scripts de base de datos)

## Frontend (`skama-webapp`)

```powershell
cd skama-webapp
npm install
npm run dev
```

Por defecto corre en `http://localhost:5173`.

Vite reenvía `/api` e `/images` a la API (`https://localhost:7157` por defecto).  
Podés cambiar el destino con la variable `VITE_API_PROXY_TARGET`.

## API (`skama-api`)

```powershell
dotnet run --project skama-api\Skama.Api\Skama.Api.csproj --launch-profile https
```

Swagger: `https://localhost:7157/swagger`

Los correos de pedido y recuperación de contraseña (**RF-006** / **RF-007**) usan SMTP. Con Gmail **no** se usa la contraseña de la cuenta: hay que crear una [contraseña de aplicación](https://support.google.com/accounts/answer/185833) (requiere verificación en 2 pasos). Esa clave y el usuario SMTP **no van en el código**; se leen desde Azure Key Vault.

Secretos en el Key Vault (los `--` se mapean a `:` en la configuración de .NET):

| Secreto en Key Vault | Configuración |
|---|---|
| `Email--Smtp--User` | correo que envía (Gmail) |
| `Email--Smtp--Password` | contraseña de aplicación |
| `Email--FromAddress` | remitente (normalmente el mismo Gmail) |

En Azure App Service (`skama-api`):

1. Activá **Identity** (system-assigned) en la Web App.
2. En el Key Vault, dales permiso **Key Vault Secrets User** a esa identidad.
3. Creá los tres secretos de la tabla.
4. En Application settings de la Web App, agregá `KeyVault__VaultUri` = `https://<tu-vault>.vault.azure.net/`.

En local, sin pegar secretos en `appsettings`:

```powershell
dotnet user-secrets set "Email:Smtp:User" "tu-correo@gmail.com" --project skama-api\Skama.Api
dotnet user-secrets set "Email:Smtp:Password" "xxxx xxxx xxxx xxxx" --project skama-api\Skama.Api
dotnet user-secrets set "Email:FromAddress" "tu-correo@gmail.com" --project skama-api\Skama.Api
```

Si SMTP no está configurado, en desarrollo el flujo de recuperación sigue funcionando con un enlace de respaldo.

La cadena de conexión está en `skama-api/Skama.Api/appsettings.json` (o `appsettings.Development.json`):

```text
Server=(localdb)\MSSQLLocalDB;Database=skama-db;Trusted_Connection=True;TrustServerCertificate=True;
```

Ajustala localmente si usás otra instancia de SQL Server.

Utilidad auxiliar: `skama-api/HashTool` genera hashes BCrypt.

## Base de datos (`skama-db`)

Desde la raíz del repositorio:

```powershell
$server = '(localdb)\MSSQLLocalDB'
$database = 'skama-db'

sqlcmd -S $server -E -Q "IF DB_ID(N'$database') IS NULL CREATE DATABASE [$database]"

$tables = @(
  'Role.sql',
  'ResultCode.sql',
  'Category.sql',
  'Promotion.sql',
  'User.sql',
  'Product.sql',
  'ProductImage.sql',
  'Cart.sql',
  'CartItem.sql',
  'CustomerProfile.sql',
  'Order.sql',
  'OrderItem.sql',
  'PasswordResetToken.sql',
  'InventoryMovement.sql',
  'EmailNotification.sql',
  'PromotionProduct.sql',
  'Review.sql',
  'WishlistItem.sql'
)

foreach ($table in $tables) {
  sqlcmd -S $server -d $database -E -b -i "skama-db\tables\$table"
}

Get-ChildItem -Path 'skama-db\stored-procedures' -Recurse -Filter *.sql |
  Sort-Object FullName |
  ForEach-Object {
    sqlcmd -S $server -d $database -E -b -i $_.FullName
  }

Push-Location 'skama-db\seeds'
sqlcmd -S $server -d $database -E -b -i 'SeedAll.sql'
Pop-Location
```

## Flujo local recomendado

1. Preparar `skama-db`
2. Levantar la API en `https://localhost:7157`
3. Levantar el frontend con `npm run dev`
4. Abrir `http://localhost:5173`
