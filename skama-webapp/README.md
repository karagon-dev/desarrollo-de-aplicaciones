# SKAMA Webapp

SKAMA frontend built with React + TypeScript + Vite.

## Requisitos

- Node.js 20+
- API de SKAMA corriendo localmente (por ejemplo `https://localhost:7157`)

## Local setup

1. Instalar dependencias:

```bash
npm install
```

2. Copiar `.env.example` a `.env` y ajustar si hace falta:

```env
VITE_API_BASE_URL=
VITE_API_PROXY_TARGET=https://localhost:7157
```

### How the API connection works

- Si `VITE_API_BASE_URL` is empty, el frontend usa rutas relativas (`/api`, `/images`).
- En desarrollo, Vite proxyea esas rutas a `VITE_API_PROXY_TARGET`.
- Por defecto, el proxy apunta a `https://localhost:7157`.

## Run

```bash
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

## CORS (API)

For deployments without the Vite proxy, add the frontend origin in `skama-api`:

- `Cors:AllowedOrigins` en `appsettings*.json`
