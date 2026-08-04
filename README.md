# SKAMA Jewelry

Solución preparada para abrir y ejecutar el prototipo aprobado de SKAMA Jewelry en Visual Studio Community o JetBrains Rider.

## Proyectos principales

- `SKAMAJewelry.Web`: aplicación ASP.NET Core MVC/Razor en .NET 9. Es la interfaz aprobada y debe usarse como proyecto de arranque para ver el diseño final.
- `skama-api/Skama.Api`: API ASP.NET Core en .NET 9 con los endpoints del backend real.
- `skama-api/HashTool`: utilidad auxiliar .NET 9 para generar hashes BCrypt.
- `skama-webapp`: prototipo frontend Vite/React conservado en el repositorio. No es la referencia visual aprobada para Visual Studio.

## Requisitos

- Visual Studio Community 2022 con la carga de trabajo "ASP.NET y desarrollo web".
- SDK de .NET 9.
- Node.js LTS con `npm`, requerido por `SKAMAJewelry.Web` para compilar los archivos TypeScript.
- SQL Server LocalDB, Express o Developer si se desea ejecutar la API real contra base de datos.
- `sqlcmd` para ejecutar los scripts de base de datos desde terminal.

## Ejecutar en Visual Studio Community

1. Clonar el repositorio:

   ```powershell
   git clone https://github.com/karagon-dev/desarrollo-de-aplicaciones.git
   ```

2. Abrir `SKAMAJewelry.sln` desde Visual Studio Community.
3. Restaurar paquetes NuGet cuando Visual Studio lo solicite.
4. Verificar que `SKAMAJewelry.Web` sea el proyecto de arranque.
5. Ejecutar con el perfil `https` o `http`.

Puertos por defecto del MVC:

- HTTPS: `https://localhost:7293`
- HTTP: `http://localhost:5189`

## Ejecutar desde terminal

```powershell
dotnet restore SKAMAJewelry.sln
dotnet build SKAMAJewelry.sln
dotnet run --project SKAMAJewelry.Web\SKAMAJewelry.Web.csproj --launch-profile https
```

## API y base de datos

La API real usa la cadena `DefaultConnection` de `skama-api/Skama.Api/appsettings.Development.json`. Por defecto apunta a:

```text
Server=(localdb)\MSSQLLocalDB;Database=skama-db;Trusted_Connection=True;TrustServerCertificate=True;
```

Para usar otra instancia de SQL Server, editar esa cadena localmente.

### Preparar `skama-db` en LocalDB

Ejecutar desde la raíz del repositorio:

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

Ejecutar la API:

```powershell
dotnet run --project skama-api\Skama.Api\Skama.Api.csproj --launch-profile https
```

Swagger queda disponible en `https://localhost:7157/swagger` cuando se usa el perfil `https`.
