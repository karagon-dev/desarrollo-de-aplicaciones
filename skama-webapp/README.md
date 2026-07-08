# SKAMA Webapp

Frontend de SKAMA construido con React + TypeScript + Vite.

## Requisitos

- Node.js 20+
- API de SKAMA corriendo localmente (por ejemplo `https://localhost:7157`)

## Configuracion local

1. Instalar dependencias:

```bash
npm install
```

2. Copiar `.env.example` a `.env` y ajustar si hace falta:

```env
VITE_API_BASE_URL=
VITE_API_PROXY_TARGET=https://localhost:7157
```

### Como funciona la conexion al API

- Si `VITE_API_BASE_URL` esta vacio, el frontend usa rutas relativas (`/api`, `/images`).
- En desarrollo, Vite proxyea esas rutas a `VITE_API_PROXY_TARGET`.
- Por defecto, el proxy apunta a `https://localhost:7157`.

## Ejecutar

```bash
npm run dev
```

## Validacion

```bash
npm run lint
npm run build
```

## CORS (API)

Para despliegues sin proxy de Vite, agregar el origen del frontend en `skama-api`:

- `Cors:AllowedOrigins` en `appsettings*.json`
