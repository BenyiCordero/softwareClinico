# QUIRURGIA Frontend

Frontend React/TypeScript para la operación clínica de QUIRURGIA.

## Stack

- React 19 y TypeScript.
- Vite y React Router.
- TanStack React Query para estado remoto.
- Axios con cookies `httpOnly` y refresh controlado.
- Zustand para sesión y sucursal activa.
- React Hook Form y Zod para formularios.
- Tailwind CSS y primitives UI reutilizables.

## Estructura

```text
src/
  app/             Providers de sesión, sucursal y queries.
  components/      Shell y componentes compartidos.
  features/        API, modelos y schemas por dominio.
  infrastructure/  Cliente HTTP y errores normalizados.
  layouts/         Layout autenticado.
  pages/           Pantallas de negocio.
  routes/          Rutas y guards.
  styles/          Tokens y estilos del shell.
```

Las páginas deben orquestar la UI; las llamadas HTTP pertenecen a `features/`.
El estado remoto pertenece a React Query y la sesión/sucursal a sus providers.

## Comandos

```bash
npm run dev
npm test
npm run lint
npm run build
```

## Configuración y entrega

Copiar `.env.example` a `.env.local` para desarrollo y ajustar
`VITE_API_URL` al prefijo público del backend. La configuración por defecto es
`/api/v1`, útil cuando frontend y API comparten origen mediante un reverse
proxy.

Antes de publicar, ejecutar en este orden:

```bash
npm test
npm run lint
npm run build
```

El directorio `dist/` generado por `npm run build` es el artefacto estático de
producción. Servirlo con fallback de SPA para que las rutas internas regresen a
`index.html`; configurar el reverse proxy de la API por separado y no incluir
secretos en variables `VITE_*`.

La validación automatizada cubre rutas canónicas y legacy, guards de permisos,
contratos ARIA de filtros/selects/modales, shell compartido, configuración de
API y scripts de entrega. La validación visual final debe hacerse en desktop y
móvil contra un backend de staging con los roles clínicos disponibles.

## Convenciones

- Usar `PageHeader`, `FilterBar`, `DataTable`, `Modal` y `QueryError` en nuevas
  pantallas cuando correspondan.
- Proteger rutas con `PermissionGuard` y acciones con `Can` o permisos locales.
- No guardar tokens en `localStorage`.
- Enviar `x-branch-id` mediante `BranchProvider` y el cliente HTTP.
- Agregar loading, empty, error con retry y estados de mutación.
- Preferir `RowActionsMenu` para acciones por registro.
- Mantener labels y estados ARIA en controles y diálogos.
