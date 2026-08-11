# Growndona

Growndona es una aplicación web mobile-first para el seguimiento organizado de cultivos. Permite crear cultivos y registrar todo lo que sucede durante su ciclo: períodos, parámetros diarios (temperatura, humedad, pH, EC, PPM), riegos, podas y otras acciones, fotografías, notas y problemas con su resolución, además de historial cronológico, gráficos y galería.

Modelo conceptual:

```
Usuario
└── Cultivos
    ├── Períodos
    ├── Registros diarios
    │   ├── Parámetros
    │   ├── Riegos
    │   ├── Acciones
    │   ├── Fotos
    │   └── Notas
    └── Problemas
        └── Fotos
```

## Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Supabase](https://supabase.com): Auth, PostgreSQL y Storage
- SCSS Modules
- [Lucide React](https://lucide.dev) (iconos)
- [Recharts](https://recharts.org) (gráficos)
- [date-fns](https://date-fns.org) (fechas)

## Instalación

Requisitos: Node.js 20+ y npm.

```bash
npm install
```

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Ambos valores están en el dashboard de Supabase, en **Project Settings → API**.

## Configurar Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. Ejecutá las migrations en orden desde el SQL Editor (ver detalle en [`supabase/README.md`](supabase/README.md)):
   1. `supabase/migrations/0001_schema.sql` — tablas, relaciones y triggers.
   2. `supabase/migrations/0002_rls.sql` — Row Level Security y policies.
   3. `supabase/migrations/0003_storage.sql` — bucket `cultivation-photos` y policies de storage.
3. En **Authentication → URL Configuration** configurá el `Site URL` (`http://localhost:3000` en desarrollo).
4. Opcional: cargá datos demo con `supabase/seed.sql` (leé las instrucciones dentro del archivo).

## Desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). Registrate, creá un cultivo y empezá a registrar.

## Build de producción

```bash
npm run build
npm start
```

## Lint

```bash
npm run lint
```

## Estructura general

```
src/
  app/
    (auth)/            login y registro
    (app)/             rutas privadas
      dashboard/       inicio con resumen del cultivo activo
      cultivos/        listado, creación, detalle, registro diario, problemas
      registrar/       acceso rápido al registro diario
      historial/       actividad reciente de todos los cultivos
      perfil/          datos del usuario y estadísticas
    auth/confirm/      confirmación de email
  components/
    layout/            AppShell, Sidebar, BottomNav, PageHeader
    ui/                Button, Field, Modal, Toast, EmptyState, ...
    cultivation/       cards, header, formularios y gestión de cultivos
    entries/           formulario de registro diario, timeline, acciones rápidas
    charts/            gráfico de parámetros
    problems/          cards, formulario y acciones de problemas
    photos/            selector de fotos, grilla y lightbox
    profile/           tarjeta de perfil
  lib/
    supabase/          clientes browser y server
    queries/           acceso a datos por dominio
    utils/             fechas, etiquetas, estadísticas
  types/               tipos de la base de datos
  styles/              estilos globales y compartidos
  proxy.ts             protección de rutas y refresh de sesión
supabase/
  migrations/          SQL para schema, RLS y storage
  seed.sql             datos demo opcionales
  README.md            guía de configuración de Supabase
```

## Notas

- Todas las rutas de la aplicación son privadas; sin sesión se redirige a `/login`.
- Las fotos se guardan en un bucket privado y se muestran mediante signed URLs.
- Los días del cultivo (`Día X`) se calculan a partir de `start_date`, nunca se guardan.
