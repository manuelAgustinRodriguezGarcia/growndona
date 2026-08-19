# Guía de estudio — Growndona

Documento basado en el código real del repositorio (agosto 2026). Si algo no está en el código, se indica explícitamente.

---

## 1. Qué es Growndona

Growndona es una aplicación web para **seguir cultivos de forma organizada**. Resuelve el problema de anotar en cuadernos, chats o fotos sueltas: centraliza en un solo lugar los datos de cada cultivo a lo largo del tiempo.

**Qué permite hacer hoy (según el código):**

- Crear una cuenta y autenticarse.
- Crear cultivos con plantas, genéticas, método, ambiente y sustrato.
- Registrar cada día: parámetros (temperatura, humedad, pH, EC, PPM), riegos, acciones (poda, defoliación, etc.), fotos y notas.
- Ver un timeline cronológico, gráficos, galería de fotos y problemas.
- Finalizar cultivos y consultar historial de actividad.

**Modelo mental del producto** (como lo describe `README.md`):

```text
Usuario
└── Cultivos
    ├── Períodos
    ├── Registros diarios
    │   ├── Parámetros (measurements)
    │   ├── Riegos
    │   ├── Acciones
    │   ├── Fotos
    │   └── Notas
    └── Problemas
        └── Fotos
```

No es una app de IA, IoT ni automatización. Es un **diario digital estructurado** para cultivadores.

---

## 2. Tecnologías utilizadas

Todas provienen de `package.json` y del código en `src/`.

### Next.js 16 (App Router)

**Qué es:** Framework de React que organiza la app en rutas, layouts y componentes. El App Router usa la carpeta `src/app/` para definir páginas.

**Para qué la usamos:** Toda la aplicación vive en `src/app/`. Las páginas como `/dashboard` o `/cultivos/[id]` son archivos `page.tsx`.

**Dónde verla:** `src/app/`, `next.config.ts`

### React 19

**Qué es:** Librería para construir interfaces con componentes reutilizables.

**Para qué la usamos:** Componentes en `src/components/`, páginas que renderizan JSX.

**Dónde verla:** Todo `src/components/` y `src/app/`

### TypeScript

**Qué es:** JavaScript con tipos estáticos. Ayuda a detectar errores antes de ejecutar.

**Para qué la usamos:** Tipar tablas de Supabase (`src/types/database.ts`), props de componentes, funciones de queries.

**Dónde verla:** `src/types/database.ts`, archivos `.tsx` y `.ts`

### Supabase (`@supabase/supabase-js` + `@supabase/ssr`)

**Qué es:** Plataforma que ofrece autenticación, base de datos PostgreSQL y almacenamiento de archivos.

**Para qué la usamos:**
- **Auth:** registro, login, recuperación de contraseña.
- **PostgreSQL:** cultivos, registros diarios, mediciones, etc.
- **Storage:** fotos en bucket privado `cultivation-photos`.

**Dónde verla:** `src/lib/supabase/`, `src/lib/queries/`, `supabase/migrations/`

### SCSS Modules

**Qué es:** CSS con alcance local por componente (cada `.module.scss` aplica solo a su componente).

**Para qué la usamos:** Estilos de componentes y páginas sin conflictos globales.

**Dónde verla:** Archivos `*.module.scss` junto a componentes; `src/styles/globals.scss`

### Recharts

**Qué es:** Librería de gráficos para React.

**Para qué la usamos:** Gráficos de evolución de parámetros (temperatura, pH, etc.).

**Dónde verla:** `src/components/charts/MeasurementChart.tsx`, `GeneticParametersPanel.tsx`

### date-fns

**Qué es:** Utilidades para trabajar con fechas.

**Para qué la usamos:** Calcular "Día X" del cultivo, formatear fechas en español.

**Dónde verla:** `src/lib/utils/dates.ts`

### Lucide React

**Qué es:** Pack de iconos SVG.

**Para qué la usamos:** Iconos en navegación, formularios, timeline, acciones.

**Dónde verla:** Importaciones desde `lucide-react` en componentes

### PWA (parcial)

**Qué es:** Progressive Web App — sitio web que puede instalarse como app.

**Para qué la usamos:** `manifest.ts` + botón de instalación en login.

**Qué falta:** No hay service worker en el código.

**Dónde verla:** `src/app/manifest.ts`, `src/components/pwa/InstallAppButton.tsx`

---

## 3. Cómo arranca la aplicación

### Comando de desarrollo

```bash
npm run dev
```

Equivale a `next dev` (ver `package.json`). Levanta el servidor en `http://localhost:3000`.

### Qué sucede al arrancar

1. **Next.js** lee `src/app/` y construye el árbol de rutas.
2. **`src/app/layout.tsx`** (layout raíz) envuelve toda la app con:
   - Fuente Geist
   - `ToastProvider` para notificaciones globales
   - Estilos globales (`globals.scss`)
3. Según la URL, Next renderiza la página correspondiente.
4. Las rutas dentro de `(app)/` pasan por **`src/app/(app)/layout.tsx`**, que:
   - Crea cliente Supabase del servidor
   - Llama `getUser()`
   - Si no hay usuario → `redirect("/login")`
   - Si hay usuario → renderiza `AppShell` con nombre y email

### Variables de entorno relevantes

Definidas en `.env.example`:

| Variable | Para qué |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (anon) para el cliente |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Alternativa a ANON_KEY |
| `NEXT_PUBLIC_SITE_URL` | URL base para metadata (opcional, default localhost) |

### Middleware / proxy

Existe `src/proxy.ts` con lógica de protección de rutas en el edge, **pero no hay `middleware.ts` que lo conecte**. Hoy la protección real ocurre en `(app)/layout.tsx`.

---

## 4. Estructura de carpetas

```text
growndona/
├── src/
│   ├── app/
│   │   ├── (auth)/           Páginas públicas de autenticación
│   │   ├── (app)/            Páginas protegidas de la app
│   │   ├── auth/confirm/     Route handler de confirmación de email
│   │   ├── layout.tsx        Layout raíz
│   │   ├── page.tsx          Landing pública (/)
│   │   └── manifest.ts       Manifest PWA
│   ├── components/
│   │   ├── layout/           AppShell, Sidebar, TopNav, BottomNav
│   │   ├── ui/               Button, Field, Modal, Toast, Select...
│   │   ├── cultivation/      Formularios y UI de cultivos
│   │   ├── entries/          Registro diario, timeline, acciones rápidas
│   │   ├── charts/           Gráficos Recharts
│   │   ├── problems/         Problemas del cultivo
│   │   ├── photos/           PhotoPicker, PhotoGrid
│   │   ├── profile/          Perfil y logout
│   │   ├── landing/          Header y menú de la landing
│   │   └── pwa/              Botón instalar app
│   ├── lib/
│   │   ├── supabase/         Clientes Supabase (browser, server, recovery)
│   │   ├── queries/          Funciones de acceso a datos
│   │   └── utils/            Fechas, labels, genéticas, mediciones
│   ├── types/
│   │   └── database.ts       Tipos TypeScript de las tablas
│   ├── styles/               Estilos globales y de formularios
│   └── proxy.ts              Protección de rutas (sin conectar)
├── supabase/
│   └── migrations/           SQL: schema, RLS, storage, plants, genetics
├── public/                   Imágenes estáticas (logos, banner)
└── package.json
```

### Para qué sirve cada carpeta

| Carpeta | Rol |
|---------|-----|
| `src/app/` | Rutas y páginas (Next.js App Router) |
| `src/components/` | UI reutilizable |
| `src/lib/queries/` | Capa de datos: todas las consultas a Supabase |
| `src/lib/supabase/` | Creación de clientes Supabase |
| `src/lib/utils/` | Lógica pura sin Supabase (fechas, labels, gráficos) |
| `src/types/` | Tipos compartidos, especialmente `Database` |
| `supabase/migrations/` | Esquema de base de datos versionado |

**Decisión particular:** Los paréntesis en `(auth)` y `(app)` son **route groups** de Next.js. Organizan archivos sin afectar la URL. `(app)/dashboard/page.tsx` → URL `/dashboard`, no `/app/dashboard`.

---

## 5. App Router y rutas

| Ruta | Archivo | Qué muestra | Requiere login |
|------|---------|-------------|----------------|
| `/` | `src/app/page.tsx` | Landing pública | No |
| `/login` | `src/app/(auth)/login/page.tsx` | Formulario de login | No |
| `/register` | `src/app/(auth)/register/page.tsx` | Registro | No |
| `/recuperar` | `src/app/(auth)/recuperar/page.tsx` | Recuperar contraseña | No |
| `/nueva-contrasena` | `src/app/(auth)/nueva-contrasena/page.tsx` | Nueva contraseña tras link | Parcial* |
| `/auth/confirm` | `src/app/auth/confirm/route.ts` | Confirma email / sesión | No |
| `/dashboard` | `src/app/(app)/dashboard/page.tsx` | Inicio con cultivo activo | Sí |
| `/dashboard?c={id}` | mismo | Inicio con cultivo seleccionado | Sí |
| `/cultivos` | `src/app/(app)/cultivos/page.tsx` | Lista de cultivos | Sí |
| `/cultivos/nuevo` | `src/app/(app)/cultivos/nuevo/page.tsx` | Crear cultivo | Sí |
| `/cultivos/[id]` | `src/app/(app)/cultivos/[id]/page.tsx` | Detalle con tabs | Sí |
| `/cultivos/[id]/editar` | `src/app/(app)/cultivos/[id]/editar/page.tsx` | Editar cultivo | Sí |
| `/cultivos/[id]/registrar` | `src/app/(app)/cultivos/[id]/registrar/page.tsx` | Registro diario | Sí |
| `/cultivos/[id]/problemas/nuevo` | `.../problemas/nuevo/page.tsx` | Crear problema | Sí |
| `/cultivos/[id]/problemas/[problemId]` | `.../problemas/[problemId]/page.tsx` | Detalle de problema | Sí |
| `/registrar` | `src/app/(app)/registrar/page.tsx` | Elegir cultivo para registrar | Sí |
| `/historial` | `src/app/(app)/historial/page.tsx` | Actividad reciente global | Sí |
| `/perfil` | `src/app/(app)/perfil/page.tsx` | Perfil y estadísticas | Sí |

\* `/nueva-contrasena` necesita sesión válida del link de recuperación.

### Tabs en `/cultivos/[id]`

Query param `?tab=` con valores: `resumen` (default), `timeline`, `parametros`, `galeria`, `problemas`, `info`.

### Rutas dinámicas `[id]`

**Qué es una ruta dinámica:** El segmento `[id]` captura un valor variable de la URL.

**Ejemplo:** `/cultivos/abc-123-def` → `params.id = "abc-123-def"`.

**En Growndona:** `src/app/(app)/cultivos/[id]/page.tsx` recibe:

```typescript
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};
```

Usa `id` para buscar el cultivo con `getCultivation(supabase, id)`. Si no existe → `notFound()`.

---

## 6. Server Components y Client Components

### Qué significan

| Concepto | Significado | En Growndona |
|----------|-------------|--------------|
| **Server Component** | Se renderiza en el servidor. Puede hacer consultas async directamente. No puede usar hooks ni eventos del navegador. | La mayoría de `page.tsx`: dashboard, cultivos, detalle |
| **Client Component** | Se renderiza en el navegador. Puede usar `useState`, `onClick`, etc. Marcado con `"use client"`. | Formularios, navegación interactiva, gráficos |

### Archivos con `"use client"` (lista real)

- Formularios: `DailyEntryForm`, `NewCultivationForm`, `EditCultivationForm`, `ProblemForm`
- Auth: `login/page.tsx`, `register/page.tsx`, `RecoverForm`, `nueva-contrasena/page.tsx`
- Interactivos: `QuickActions`, `MeasurementChart`, `PhotoPicker`, `PhotoGrid`, `Modal`, `Select`, `DatePicker`
- Layout: `BottomNav`, `Sidebar`, `CultivationSectionNav`
- Otros: `Toast`, `ProfileCard`, `PeriodManager`, `PeriodList`, `CultivationDangerZone`, `ProblemActions`, `InstallAppButton`, `LandingMenu`, `(app)/error.tsx`

### Por qué un componente es Client

| Necesidad | Ejemplo en Growndona |
|-----------|---------------------|
| Estado local (`useState`) | `DailyEntryForm` guarda valores de inputs |
| Eventos (`onClick`, `onSubmit`) | Botón guardar en formularios |
| Hooks del navegador | `useRouter`, `usePathname` en `BottomNav` |
| APIs del browser | `File` en `PhotoPicker`, `localStorage` en `InstallAppButton` |
| Librerías solo client | Recharts en `MeasurementChart` |

### Patrón típico en Growndona

```text
page.tsx (Server Component)
  → consulta Supabase en el servidor
  → pasa datos como props
  → renderiza Client Component (formulario)
      → usuario interactúa
      → Client Component llama Supabase desde el navegador
      → router.push / router.refresh
```

Ejemplo concreto: `cultivos/[id]/registrar/page.tsx` (server) carga datos y renderiza `DailyEntryForm` (client).

---

## 7. Componentes principales

Solo los componentes que más importan para entender el proyecto.

### DailyEntryForm

| Aspecto | Detalle |
|---------|---------|
| **Archivo** | `src/components/entries/DailyEntryForm.tsx` |
| **Responsabilidad** | Formulario completo de registro diario |
| **Props** | `cultivationId`, `userId`, `date`, `existing`, `existingPhotos`, `plants`, `genetics` |
| **Estado** | `values` (parámetros por genética), `irrigation`, `selectedActions`, `notes`, `newFiles`, `saving`, `error` |
| **Funciones clave** | `handleSubmit` → upsert entry, measurements, actions, irrigation, photos |
| **Usa** | `PhotoPicker`, `DatePicker`, `Button`, queries de `entries`, `genetics`, `photos` |
| **Datos** | Tablas: `daily_entries`, `measurements`, `actions`, `irrigations`, `photos`, `cultivation_genetics` |
| **Por qué separado** | Es el corazón de la app; concentra toda la lógica de guardado diario |

### NewCultivationForm

| Aspecto | Detalle |
|---------|---------|
| **Archivo** | `src/components/cultivation/NewCultivationForm.tsx` |
| **Responsabilidad** | Crear cultivo + plantas + período inicial + cover |
| **Props** | `userId` |
| **Estado** | `name`, `startDate`, `plantCount`, `plantDrafts`, `generalMode`, `coverFiles`, `saving` |
| **Funciones clave** | `handleSubmit` → `createCultivation`, `createPlants`, `createPeriod`, upload cover |
| **Usa** | `PlantsSection`, `PhotoPicker`, queries de `cultivations`, `plants`, `photos` |
| **Por qué separado** | Flujo de creación complejo con múltiples tablas |

### TimelineEntry

| Aspecto | Detalle |
|---------|---------|
| **Archivo** | `src/components/entries/TimelineEntry.tsx` |
| **Responsabilidad** | Mostrar un día en el timeline |
| **Props** | `entry`, `startDate`, `periods`, `photoUrls`, `problems`, `geneticNames` |
| **Estado** | Ninguno (Server Component) |
| **Funciones** | Calcula `dayNumber`, busca período, renderiza mediciones/acciones/fotos |
| **Por qué separado** | Reutilizado en tab timeline del detalle de cultivo |

### AppShell

| Aspecto | Detalle |
|---------|---------|
| **Archivo** | `src/components/layout/AppShell.tsx` |
| **Responsabilidad** | Layout principal: TopNav + Sidebar + contenido + BottomNav |
| **Props** | `userName`, `userEmail`, `children` |
| **Usa** | `TopNav`, `Sidebar`, `BottomNav` |
| **Por qué separado** | Todas las páginas protegidas comparten este layout |

### QuickActions

| Aspecto | Detalle |
|---------|---------|
| **Archivo** | `src/components/entries/QuickActions.tsx` |
| **Responsabilidad** | Accesos rápidos: registrar, regar, foto, problema |
| **Props** | `cultivationId`, `userId` |
| **Estado** | `busy`, confirmación de riego |
| **Por qué separado** | Aparece en dashboard y resumen de cultivo |

### MeasurementChart

| Aspecto | Detalle |
|---------|---------|
| **Archivo** | `src/components/charts/MeasurementChart.tsx` |
| **Responsabilidad** | Gráfico de línea de un parámetro |
| **Props** | `series`, `keys?`, `height?`, `showStats?` |
| **Estado** | `selectedParam` (qué parámetro mostrar) |
| **Usa** | Recharts, `fieldStats` de `measurements.ts` |
| **Por qué separado** | Recharts solo funciona en client |

### PlantsSection

| Aspecto | Detalle |
|---------|---------|
| **Archivo** | `src/components/cultivation/PlantsSection.tsx` |
| **Responsabilidad** | UI para configurar plantas (genética, método, etc.) |
| **Props** | `plants`, `onPlantsChange`, `mode`, `onModeChange` |
| **Estado** | Campos generales, acordeones por planta |
| **Por qué separado** | Lógica compartida entre crear y editar cultivo |

---

## 8. Navegación

### Elementos que existen

| Componente | Archivo | Cuándo se ve |
|------------|---------|--------------|
| **BottomNav** | `src/components/layout/BottomNav.tsx` | Mobile (< 768px), fijo abajo |
| **TopNav** | `src/components/layout/TopNav.tsx` | Mobile, fijo arriba (logo verde) |
| **Sidebar** | `src/components/layout/Sidebar.tsx` | Desktop (≥ 768px), fijo a la izquierda |

### Items de navegación

Definidos en `src/components/layout/navItems.ts`:

| href | label | icono |
|------|-------|-------|
| `/dashboard` | Inicio | Home |
| `/cultivos` | Mis cultivos | Sprout |
| `/registrar` | Registrar | NotebookTabs (highlight) |
| `/historial` | Historial | History |
| `/perfil` | Perfil | User |

### Cómo se determina el link activo

Función `isActivePath(pathname, href)` en `navItems.ts`:

- `/dashboard` → match exacto
- Resto → `pathname === href` o `pathname.startsWith(href + "/")`

`BottomNav` y `Sidebar` usan `usePathname()` de Next.js para comparar.

### Navegación por tabs del cultivo

`CultivationSectionNav` (`src/components/cultivation/CultivationSectionNav.tsx`):

- Desktop: pills horizontales
- Mobile: dropdown
- Usa `useTransition` para mostrar loading al cambiar tab
- Links: `/cultivos/{id}?tab=timeline`, etc.

---

## 9. Supabase

### Qué papel cumple

| Servicio | Rol en Growndona |
|----------|------------------|
| **Auth** | Registro, login, logout, recuperación, confirmación email |
| **PostgreSQL** | Todas las tablas de datos (cultivos, entries, etc.) |
| **Storage** | Fotos en bucket privado `cultivation-photos` |

### Cómo se conecta Next.js con Supabase

Tres archivos crean clientes:

| Archivo | Función | Cuándo usar |
|---------|---------|-------------|
| `src/lib/supabase/client.ts` | `createClient()` | En Client Components (navegador) |
| `src/lib/supabase/server.ts` | `createClient()` async | En Server Components y route handlers |
| `src/lib/supabase/recovery.ts` | `createRecoveryClient()` | Solo recuperación de contraseña |

**Por qué hay clientes distintos:**

- **Browser:** necesita acceso a cookies del navegador para mantener sesión.
- **Server:** lee/escribe cookies de Next.js (`cookies()`).
- **Recovery:** cliente aislado con `storageKey: "growndona-recovery"` para no mezclar sesión de reset con la normal.

Todos usan `NEXT_PUBLIC_SUPABASE_URL` y la clave anon/publishable. Tipados con `Database` de `src/types/database.ts`.

### Capa de queries

Toda consulta pasa por `src/lib/queries/*.ts`. Las páginas **no** llaman `.from("cultivations")` directamente (salvo auth en formularios).

---

## 10. Autenticación

### Registro

**Archivo:** `src/app/(auth)/register/page.tsx`

1. Usuario completa: nombre, username, email, contraseña, confirmación.
2. Validaciones locales:
   - Username: regex `^[a-z0-9_]{3,20}$`
   - Contraseña ≥ 6 caracteres
   - Contraseñas coinciden
3. RPC `get_email_for_username` verifica que el username no exista.
4. `supabase.auth.signUp({ email, password, options: { data: { name, username }, emailRedirectTo: origin/auth/confirm } })`
5. Trigger `handle_new_user` en DB crea fila en `profiles`.
6. Si no hay sesión inmediata → mensaje "Revisá tu email".
7. Si hay sesión → redirect `/dashboard`.

### Login

**Archivo:** `src/app/(auth)/login/page.tsx`

1. Usuario ingresa email **o** username + contraseña.
2. Si no contiene `@` → RPC `get_email_for_username` resuelve el email.
3. `signInWithPassword({ email, password })`
4. Errores traducidos con `translateError()` (español).
5. Éxito → `/dashboard` + `router.refresh()`.

### Logout

**Archivos:** `Sidebar.tsx` (`handleLogout`), `ProfileCard.tsx` (`LogoutButton`)

1. `supabase.auth.signOut()`
2. Redirect `/login` + refresh

### Recuperación de contraseña

**Archivo:** `src/app/(auth)/recuperar/RecoverForm.tsx`

1. Usuario ingresa email o username.
2. Usa `createRecoveryClient()` (cliente aislado).
3. Si es username → resuelve email con RPC.
4. `resetPasswordForEmail(email, { redirectTo: origin/nueva-contrasena })`
5. Siempre muestra mensaje genérico de éxito (por seguridad).

### Nueva contraseña

**Archivo:** `src/app/(auth)/nueva-contrasena/page.tsx`

1. `useEffect` restaura sesión desde tokens en URL hash o sesión existente.
2. Usuario ingresa nueva contraseña.
3. `updateUser({ password })`
4. Redirect `/dashboard`.

### Confirmación de email

**Archivo:** `src/app/auth/confirm/route.ts` (GET)

1. Recibe `token_hash`, `type`, `code`, `next` de la URL.
2. `verifyOtp` o `exchangeCodeForSession`.
3. Recovery → `/nueva-contrasena`; registro → `/dashboard`.
4. Error → `/login?error=link` o `/recuperar?error=link`.

### Protección de rutas

| Mecanismo | Estado |
|-----------|--------|
| `(app)/layout.tsx` → `getUser()` → redirect | **Activo** |
| Páginas individuales con `redirect("/login")` | **Activo** |
| `src/proxy.ts` (middleware edge) | **Existe pero no conectado** |

---

## 11. Row Level Security (RLS)

### Qué es RLS

**Row Level Security** es una feature de PostgreSQL que filtra filas según quién consulta. En Supabase, `auth.uid()` devuelve el ID del usuario logueado.

**Para qué se usa:** Evitar que un usuario vea o modifique datos de otro, **incluso si manipula el frontend**.

### Por qué Growndona lo necesita

La app llama a Supabase directamente desde el navegador con la clave anon. Sin RLS, cualquiera podría leer todos los cultivos. RLS es la barrera real de seguridad.

### Cómo funciona en la práctica

**Archivo:** `supabase/migrations/0002_rls.sql`

| Tabla | Regla |
|-------|-------|
| `profiles` | `id = auth.uid()` |
| `cultivations` | `user_id = auth.uid()` |
| Tablas hijas (entries, periods, etc.) | Funciones helper: `owns_cultivation()`, `owns_daily_entry()`, `owns_problem()` |

**Ejemplo concreto:** Usuario A intenta leer cultivations de Usuario B:

```sql
-- Policy: user_id = auth.uid()
-- auth.uid() = id de A
-- Solo devuelve filas donde user_id = A
```

**Storage:** En `0003_storage.sql`, el primer segmento del path debe ser `auth.uid()`:

```text
{userId}/{cultivationId}/...
```

---

## 12. Base de datos

### Esquema de relaciones

```text
auth.users
    ↓
profiles
    ↓
cultivations
    ├── plants
    ├── cultivation_genetics
    ├── cultivation_periods
    ├── problems
    │   └── problem_photos
    ↓
daily_entries  (UNIQUE: cultivation_id + entry_date)
    ├── measurements  (UNIQUE: daily_entry_id + genetic_id)
    ├── actions
    ├── irrigations
    └── photos
```

### Tablas principales

#### profiles

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | = auth.users.id |
| `name` | text | Nombre visible |
| `username` | text | Único, lowercase (migration 0004) |
| `avatar_url` | text | Path en storage |

**Usada en:** perfil, AppShell (nombre de usuario)

#### cultivations

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → auth.users | Dueño |
| `name`, `start_date` | text, date | Obligatorios |
| `plant_count` | integer | Default 1 |
| `genetics`, `method`, `medium`, `environment` | text | Resumen del cultivo |
| `status` | text | `active` \| `finished` |
| `cover_image_url` | text | Path en storage |
| `harvest_grams`, `final_grams` | numeric | Migration 0005 |

**Usada en:** toda la app de cultivos

#### plants

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `cultivation_id` | uuid FK | |
| `number` | integer | UNIQUE con cultivation_id |
| `genetics`, `method`, `environment`, `medium` | text | Por planta |

**Usada en:** crear/editar cultivo, agrupar genéticas en registro diario

#### cultivation_genetics

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `cultivation_id` | uuid FK | |
| `name` | text | Nombre visible |
| `name_key` | text | lowercase trim, UNIQUE con cultivation_id |

**Usada en:** FK de `measurements.genetic_id`, gráficos por genética

#### daily_entries

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `cultivation_id` | uuid FK | |
| `entry_date` | date | UNIQUE con cultivation_id |
| `notes` | text | Notas del día |

**Usada en:** registro diario, timeline, historial

#### measurements

| Campo | Tipo | Notas |
|-------|------|-------|
| `daily_entry_id` | uuid FK | |
| `genetic_id` | uuid FK nullable | null = parámetros generales |
| `temperature`, `humidity`, `ph`, `ec`, `ppm` | numeric | Todos nullable |

**Usada en:** formulario diario, gráficos, dashboard

#### actions, irrigations, photos, problems

Ver migrations `0001_schema.sql`. Cada una tiene FK a `daily_entries` o `cultivations`.

---

## 13. Cultivos

### Flujo completo

```text
/cultivos/nuevo
    ↓
NewCultivationForm.handleSubmit
    ↓
createCultivation → tabla cultivations
createPlants → tabla plants
createPeriod (opcional) → cultivation_periods
uploadPhoto + updateCultivation (cover opcional)
    ↓
redirect /cultivos/{id}
```

### Consultar

- Lista: `/cultivos` → `getCultivations()` + signed URLs de covers
- Detalle: `/cultivos/[id]` → `getCultivation`, `getEntries`, `getProblems`, `getCultivationGenetics`

### Editar

- `/cultivos/[id]/editar` → `EditCultivationForm`
- `updateCultivation`, sync plants (create/update/delete)

### Finalizar

- `CultivationDangerZone` o `PeriodManager` (tipo `finished`)
- `finishCultivation()` → cierra períodos abiertos, `status = 'finished'`, `end_date`

### Eliminar

- `CultivationDangerZone` → `deleteCultivation()` → cascade por FKs en DB

### Plantas, genéticas, método, ambiente, sustrato

- **1 planta:** campos directos en el formulario.
- **Varias plantas:** `PlantsSection` con modos:
  - Todas iguales
  - Cada una distinta
  - Solo genética distinta
- Al guardar, `cultivations` guarda resumen (`sharedPlantValue`) y `plants` guarda detalle por planta.

---

## 14. Plantas y genéticas

### Diferencia conceptual

| | `plants` | `cultivation_genetics` |
|--|----------|------------------------|
| **Qué representa** | Cada planta individual (#1, #2...) | Nombre de genética normalizado |
| **Cuándo se crea** | Al crear/editar cultivo | Al guardar mediciones (lazy) o backfill en migration |
| **Para qué sirve** | Configuración por planta; agrupar tabs en formulario | FK de measurements; gráficos por genética |

### Por qué existen ambas

- **`plants`:** el cultivador piensa en "tengo 3 plantas, 2 Orbiter y 1 Gelato".
- **`cultivation_genetics`:** la DB necesita una fila estable para vincular mediciones cuando hay múltiples genéticas el mismo día.

### Cómo se determina cuándo comparten genética

Función `getGeneticGroups(plants)` en `src/lib/utils/genetics.ts`:

1. Recorre plantas.
2. Agrupa por `normalizeGeneticName(genetics)` (trim + lowercase).
3. Si hay 0 grupos → formulario usa clave `__general__`.
4. Si hay 1+ grupos → un tab de parámetros por genética.

### Múltiples genéticas

- En el formulario: tabs para cada genética.
- Al guardar: `ensureCultivationGenetic()` crea fila en `cultivation_genetics` si no existe.
- En measurements: una fila por `(daily_entry_id, genetic_id)`.
- En gráficos: `buildGeneticSeries()` separa series por genética.

---

## 15. Registro diario

Flujo cronológico completo — **el corazón de Growndona**.

### 1. Usuario toca "Registrar"

Entradas posibles:
- BottomNav → `/registrar`
- QuickActions → `/cultivos/{id}/registrar`
- Timeline → "Editar" → `?fecha=YYYY-MM-DD`

### 2. Selección del cultivo

**Archivo:** `src/app/(app)/registrar/page.tsx`

- 0 activos → EmptyState "Creá un cultivo"
- 1 activo → redirect automático a `/cultivos/{id}/registrar`
- 2+ activos → lista de `CultivationCard` para elegir

### 3. Carga de la página de registro

**Archivo:** `src/app/(app)/cultivos/[id]/registrar/page.tsx` (Server Component)

1. `getCultivation(id)` — si no existe → `notFound()`
2. Fecha: query `?fecha=` o `todayISO()`
3. Parallel fetch: `getEntryByDate`, `getPlants`, `getCultivationGenetics`
4. Signed URLs para fotos existentes
5. Renderiza `DailyEntryForm` con `key={date}` (reinicia estado al cambiar fecha)

### 4. Selección de fecha

**Componente:** `DatePicker` en `DailyEntryForm`

- `handleDateChange` → `router.replace(/cultivos/{id}/registrar?fecha={date})`
- Máximo: hoy (`max={todayISO()}`)

### 5. Carga de parámetros

- `getGeneticGroups(plants)` define tabs.
- Campos: temperatura, humedad, pH, EC, PPM (`MEASUREMENT_FIELDS` en `labels.ts`).
- Estado: `values[key][field]` como strings.

### 6. Selección de genética

- 1 genética o ninguna → un solo bloque de parámetros.
- Varias genéticas → tabs con `selectedKey`.

### 7. Acciones

- Botones toggle para: poda, defoliación, trasplante, entrenamiento, cambio solución, limpieza, otro.
- Estado: `selectedActions[]`, `actionNotes{}`.

### 8. Riego

- Toggle on/off.
- Nota opcional.

### 9. Notas

- Textarea libre → `daily_entries.notes`.

### 10. Fotografías

- `PhotoPicker` selecciona archivos.
- Validación: JPG/PNG/WEBP, max 5MB.
- Fotos existentes se pueden eliminar (`removedPhotoIds`).

### 11. Validaciones (submit)

En `DailyEntryForm.handleSubmit`:

1. Parse decimal (acepta coma o punto).
2. Rangos: temp -20–70, humidity 0–100, pH 0–14, EC/PPM 0–10000.
3. Al menos un dato: parámetro, riego, acción, foto o nota.

### 12. Guardado

Orden en `handleSubmit`:

```text
upsertDailyEntry(cultivationId, date, notes)
    ↓
por cada genética: saveMeasurements(entryId, geneticId, values)
    → ensureCultivationGenetic si hace falta
    ↓
replaceActions(entryId, actions[])
    ↓
setEntryIrrigation(entryId, hasIrrigation, notes)
    ↓
deletePhoto (fotos removidas)
    ↓
uploadPhoto + addPhotoRecord (fotos nuevas)
```

### 13. Actualización de UI

- `toast("Registro guardado")`
- `router.push(/cultivos/{id}?tab=timeline)`
- `router.refresh()`

### 14. Aparición en timeline

**Archivo:** `src/app/(app)/cultivos/[id]/page.tsx` tab `timeline`

- `getEntries()` ordenado por fecha DESC
- Cada entry → `TimelineEntry` con día, período, parámetros, badges, fotos, problemas del día

---

## 16. Parámetros

### Campos disponibles

Definidos en `src/lib/utils/labels.ts` como `MEASUREMENT_FIELDS`:

| Campo DB | Label UI | Tipo |
|----------|----------|------|
| `temperature` | Temperatura | numeric (°C) |
| `humidity` | Humedad | numeric (%) |
| `ph` | pH | numeric |
| `ec` | EC | numeric |
| `ppm` | PPM | numeric |

Todos son **nullable** en DB: podés registrar solo algunos.

### Validaciones

En `DailyEntryForm.tsx`, constante `RANGES`:

| Campo | Min | Max |
|-------|-----|-----|
| temperature | -20 | 70 |
| humidity | 0 | 100 |
| ph | 0 | 14 |
| ec | 0 | 10000 |
| ppm | 0 | 10000 |

### Por qué `measurements` está separado de `daily_entries`

- Un día puede tener **varias filas** de measurements (una por genética).
- Permite borrar parámetros sin borrar el día entero.
- Facilita queries de gráficos sin mezclar con riegos/acciones.

### Cómo funciona `genetic_id`

| Valor | Significado |
|-------|-------------|
| `null` | Parámetros generales (sin genética específica) |
| uuid | Parámetros de esa genética en `cultivation_genetics` |

Constraint: `UNIQUE (daily_entry_id, genetic_id)` — una fila por genética por día.

### Una genética vs múltiples

| Situación | UI | DB |
|-----------|-----|-----|
| 1 planta o todas misma genética | Un bloque de parámetros | 1 fila measurement (genetic_id null o único) |
| Varias genéticas | Tab por genética | 1 fila measurement por genética |

---

## 17. Modo Simple y Avanzado

> **Pendiente de implementación.**

En el código actual, el formulario de registro muestra **siempre los 5 parámetros** (temperatura, humedad, pH, EC, PPM). No hay toggle Simple/Avanzado.

**Decisión de arquitectura futura** (según PRD y specs en `docs/superpowers/`):

- Mismo flujo de registro con **progressive disclosure**.
- Simple: solo parámetros principales.
- Avanzado: VPD, PPFD, CO₂, etc. (cuando se implementen).
- No dos sistemas separados.

---

## 18. Riegos

### Cómo se registra

- En `DailyEntryForm`: toggle "Registré riego" + nota opcional.
- En `QuickActions`: botón rápido con confirmación.

### Dónde se almacena

Tabla `irrigations`:
- `daily_entry_id` FK
- `performed_at` (default `now()`)
- `notes`

### Relación con daily_entries

Un riego siempre pertenece a un `daily_entry`. Función `setEntryIrrigation()` en `entries.ts`:
- Activar → insert si no existe
- Desactivar → delete
- Actualizar nota → update

### Cómo aparece en timeline

`TimelineEntry` muestra badge "Riego" si `entry.irrigations.length > 0`.

### Qué NO existe

> Hora de riego editable (`performed_at` siempre es default now).
> Múltiples riegos por día (solo 0 o 1).
> Volumen de agua / nutrientes.

---

## 19. Acciones

### Tipos disponibles

Definidos en DB y `ActionType` en `database.ts`:

| type | Label (español) |
|------|-----------------|
| `pruning` | Poda |
| `defoliation` | Defoliación |
| `transplant` | Trasplante |
| `training` | Entrenamiento |
| `solution_change` | Cambio de solución |
| `cleaning` | Limpieza |
| `other` | Otra |

### Cómo se guardan

`replaceActions()` en `entries.ts`:
1. Delete todas las actions del entry.
2. Insert las seleccionadas.

Cada action: `type`, `notes` opcional, `performed_at` default now.

### Relación con registro diario

Las actions viven en `daily_entries`. No existen fuera de un día registrado.

### Timeline

Badges con label de cada acción en `TimelineEntry`.

---

## 20. Problemas

### Flujo

```text
/cultivos/{id}/problemas/nuevo
    ↓
ProblemForm → createProblem + upload fotos
    ↓
status = 'active'
    ↓
/cultivos/{id}/problemas/{problemId}
    ↓
ProblemActions: resolver / reabrir / eliminar
    ↓
resolveProblem → status = 'resolved', solution, resolved_at
```

### Tablas

- `problems`: title, description, detected_at, status, solution, resolved_at
- `problem_photos`: storage_path por foto

### Fotografías

Sí existen. `ProblemForm` usa `PhotoPicker`. Path: `{userId}/{cultivationId}/problems/{problemId}/...`

### Timeline

Problemas con `detected_at === entry_date` aparecen en `TimelineEntry` ese día.

---

## 21. Fotografías

### Selección

`PhotoPicker` (`src/components/photos/PhotoPicker.tsx`):
- Input file (single o multiple)
- Preview con `useMemo` + `URL.createObjectURL`
- Validación via `validatePhotoFile()`

### Subida

1. `buildEntryPhotoPath(userId, cultivationId, entryId, fileName)`
2. `uploadPhoto(supabase, path, file)` → Supabase Storage
3. `addPhotoRecord(supabase, entryId, path)` → tabla `photos`

### Storage

| Aspecto | Valor |
|---------|-------|
| Bucket | `cultivation-photos` (privado) |
| Límite | 5 MB |
| Formatos | JPEG, PNG, WEBP |
| Path | `{userId}/{cultivationId}/{entryId}/{timestamp-random-name}` |

### Signed URLs

Las fotos **no son públicas**. Para mostrarlas:

- `getSignedUrl(path)` o `getSignedUrlMap(paths)` 
- Expiran en 3600 segundos (1 hora) por defecto
- Se generan en el servidor al renderizar páginas

### Compresión

> **No implementada.** Los archivos se suben tal cual los selecciona el usuario.

### Privacidad

- Bucket privado + RLS en storage (primer folder = userId)
- RLS en tabla `photos` via `owns_daily_entry()`

---

## 22. Timeline

### Cómo se construye

**Archivo:** `src/app/(app)/cultivos/[id]/page.tsx`, tab `timeline`

1. `getEntries(supabase, cultivationId)` — entries con measurements, irrigations, actions, photos (join en query)
2. Orden: `entry_date DESC` (más reciente arriba)
3. Signed URLs para todas las fotos
4. Map → `TimelineEntry` por cada entry

### Qué muestra cada entry

| Dato | Origen |
|------|--------|
| "Día X" | `dayNumber(start_date, entry_date)` |
| Período | `periodForDate(periods, entry_date)` |
| Parámetros | `entry.measurements`, ordenados por genética |
| Riego | Badge si hay irrigations |
| Acciones | Badges por tipo |
| Fotos | Thumbnails con signed URL |
| Notas | `entry.notes` |
| Problemas | Filtrados por `detected_at === entry_date` |
| Editar | Link a `/registrar?fecha={entry_date}` |

### Día X — cálculo

```typescript
// src/lib/utils/dates.ts
dayNumber(startDate, date) = differenceInCalendarDays(date, startDate) + 1
```

Día 1 = fecha de inicio del cultivo. **No se guarda en DB.**

---

## 23. Galería

### De dónde obtiene fotos

Tab `galeria` en `/cultivos/[id]`:

1. `getEntries()` ya trae `photos` por entry
2. Flatten: todas las fotos de todos los entries
3. Signed URLs via `getSignedUrlMap`
4. Orden: por entry (entries vienen DESC por fecha)

### Qué muestra cada foto

Tipo `GalleryPhoto`:
- `url`, `caption`, `day` (número de día), `date` (formato corto)

### Componente

`PhotoGrid` con lightbox (navegación con teclado via `useEffect`).

### Nota

Existe `getCultivationPhotos()` en `photos.ts` pero **no se usa**. La galería se arma desde entries.

---

## 24. Gráficos

### Librería

Recharts en `MeasurementChart.tsx` y `GeneticParametersPanel.tsx`.

### De dónde vienen los datos

1. Server: `getEntries()` + `getCultivationGenetics()`
2. `buildGeneticSeries(entries, genetics)` → array de series por genética
3. Cada punto: `{ entry_date, temperature, humidity, ph, ec, ppm }`

### Transformación

- Orden ascendente por fecha
- Filtra nulls para el parámetro seleccionado
- Dashboard: últimos 14 puntos (`series.slice(-14)`)

### Selección de genética

- 1 serie → gráfico directo
- Varias → `GeneticParametersPanel` con `Select` para elegir genética

### Parámetros mostrables

Los 5: temperatura, humedad, pH, EC, PPM. Selector de tabs en el gráfico.

### Estadísticas

`fieldStats()` calcula last, min, max, avg cuando `showStats={true}`.

---

## 25. Dashboard

**Archivo:** `src/app/(app)/dashboard/page.tsx`

### Flujo de datos

```text
getCultivations() → filter active
    ↓
selected = ?c= param o primer activo
    ↓
parallel: getEntries, getProblems, getCultivationGenetics
    ↓
buildGeneticSeries → latestPerField → MeasurementGrid
    ↓
MeasurementChart (últimos 14 días)
```

### Secciones

| Sección | Fuente |
|---------|--------|
| Cultivo activo | `CultivationHeader` con cover signed URL |
| Switcher | Si hay 2+ activos, chips con `?c=id` |
| Acciones rápidas | `QuickActions` |
| Actividad | Derivado de entries (último registro, riego, poda) |
| Últimos parámetros | `latestPerField(geneticSeries)` |
| Problemas activos | Max 3 `ProblemCard` |
| Evolución reciente | `MeasurementChart` por genética |

### Día actual / período

`CultivationHeader` calcula día con `currentDayNumber()` y período con `currentPeriod()`.

---

## 26. Cálculos derivados

Valores **no guardados en DB**, calculados en código:

| Valor | Función | Archivo |
|-------|---------|---------|
| Día del cultivo | `dayNumber(start, date)` | `dates.ts` |
| Día actual | `currentDayNumber(start, end?)` | `dates.ts` |
| Días totales | `daysBetween(start, end?)` | `dates.ts` |
| Período activo | `currentPeriod(periods)` | `labels.ts` |
| Período de una fecha | `periodForDate(periods, date)` | `labels.ts` |
| Último valor por parámetro | `latestPerField(series)` | `measurements.ts` |
| Stats (min/max/avg) | `fieldStats(series, key)` | `measurements.ts` |
| Grupos de genética | `getGeneticGroups(plants)` | `genetics.ts` |
| Estadísticas perfil | `getProfileStats()` | `profile.ts` |

### Por qué calcular en vez de guardar

- Evita inconsistencias (ej: "día 45" desactualizado si cambia start_date).
- Menos columnas en DB.
- La lógica vive en un solo lugar (`lib/utils/`).

---

## 27. TypeScript en Growndona

### type — alias de tipo

**Qué es:** Nombre para un tipo existente o combinación.

**Ejemplo real:**

```typescript
// src/types/database.ts
export type CultivationStatus = "active" | "finished";
```

**Qué error evita:** Pasar `"activo"` cuando solo vale `"active"` o `"finished"`.

### interface / type para objetos

**Ejemplo:**

```typescript
export type Cultivation = {
  id: string;
  name: string;
  status: CultivationStatus;
  // ...
};
```

**Qué error evita:** Olvidar campos obligatorios al crear un objeto cultivo.

### Props tipadas

**Ejemplo:**

```typescript
type DailyEntryFormProps = {
  cultivationId: string;
  userId: string;
  date: string;
  existing: EntryDetails | null;
  // ...
};
```

**Qué error evita:** Pasar props incorrectas al componente.

### Union types

**Ejemplo:**

```typescript
export type ActionType =
  | "pruning"
  | "defoliation"
  | "transplant"
  // ...
```

**Qué error evita:** Guardar un tipo de acción que no existe en DB.

### Optional properties

**Ejemplo:**

```typescript
genetics: string | null;
description: string | null;
```

**Qué error evita:** Asumir que siempre hay genética cuando puede ser null.

### Tipos de Supabase

`Database` en `database.ts` tipa `.from("cultivations")` etc. Los clientes Supabase usan `SupabaseClient<Database>`.

### Tipos compuestos

```typescript
// src/lib/queries/entries.ts
export type EntryDetails = DailyEntry & {
  measurements: Measurement[];
  irrigations: Irrigation[];
  actions: Action[];
  photos: Photo[];
};
```

Combina fila base + relaciones del join.

### Posibles simplificaciones

> El tipo `Database` con `TableDef` genérico es más complejo que tipos planos. Funciona bien pero puede intimidar al principio. No es necesario entenderlo al 100% para usar el proyecto.

---

## 28. Estado y React

### useState

**Qué es:** Hook para guardar valor que cambia y re-renderiza el componente.

**Ejemplo:** `DailyEntryForm` — `const [saving, setSaving] = useState(false)`

**Por qué:** El botón debe mostrar loading y deshabilitarse al guardar.

**Sin él:** No habría feedback visual al submit.

### useEffect

**Qué es:** Hook que ejecuta código después del render (efectos secundarios).

**Ejemplos reales:**
- `nueva-contrasena/page.tsx`: restaurar sesión del link
- `PhotoGrid`: listener de teclado para lightbox
- `DatePicker`: cerrar al click fuera

### useMemo

**Qué es:** Memoriza un valor calculado para no recalcular en cada render.

**Ejemplo:** `MeasurementChart` — filtra datos del gráfico.

**Ejemplo:** `PhotoPicker` — genera previews de archivos.

### useCallback

**Qué es:** Memoriza una función.

**Ejemplo:** `PhotoGrid` — funciones de navegación del lightbox.

### useTransition

**Qué es:** Marca navegación como no urgente, permite mostrar loading.

**Ejemplo:** `CultivationSectionNav` — overlay al cambiar tab.

### useRouter / usePathname

**Qué es:** Hooks de Next.js para navegar y leer URL actual.

**Ejemplo:** `BottomNav` usa `usePathname()` para marcar item activo.

### useContext

**Ejemplo:** `useToast()` accede al contexto de notificaciones globales.

### ¿Son todos necesarios?

En general sí para la interactividad actual. Algunos `useEffect` podrían simplificarse, pero funcionan correctamente.

---

## 29. Formularios

### Patrón general en Growndona

1. Client Component con `"use client"`
2. Estado local con `useState` por campo
3. Inputs **controlados**: `value={state}` + `onChange`
4. `handleSubmit` previene default, valida, llama Supabase
5. Feedback: `error` local + `toast()` + redirect

### No se usa

- react-hook-form
- Zod
- Formularios no controlados (salvo file inputs nativos)

### Ejemplo: login

```typescript
const [identifier, setIdentifier] = useState("");
// ...
<Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
```

### Submit y loading

```typescript
setSaving(true);
try {
  await createCultivation(...);
  toast("Cultivo creado");
  router.push(...);
} catch {
  setError("No se pudo...");
  setSaving(false);
}
```

### Validación

Siempre manual en `handleSubmit`, antes de llamar Supabase.

---

## 30. Manejo de errores

| Tipo | Cómo se maneja |
|------|----------------|
| Error Supabase en queries | `if (error) throw error` → catch en formulario |
| Validación de formulario | `setError("mensaje")` antes de submit |
| Auth | `translateError()` en login |
| Confirm link inválido | Redirect con `?error=link` |
| Cultivo no encontrado | `notFound()` |
| Error de app | `(app)/error.tsx` con botón reset |
| Upload fallido | Catch genérico en formulario |
| Signed URL fallida | Se omite la foto silenciosamente |
| Limpieza storage | `.catch(() => {})` no bloqueante |

### Inconsistencias

- Algunos errores son genéricos ("Intentá de nuevo") sin detalle al usuario.
- `console.error` solo en auth confirm y nueva contraseña.

---

## 31. Loading y feedback al usuario

| Mecanismo | Dónde |
|-----------|-------|
| `LoadingScreen` | `(app)/loading.tsx` — splash al cambiar de ruta |
| `Button loading={true}` | Formularios — spinner en botón |
| `saving` / `loading` / `busy` state | Deshabilita submit durante operación |
| `useTransition` + overlay | `CultivationSectionNav` al cambiar tab |
| Toast éxito/error | `useToast()` global via `ToastProvider` |
| "Verificando el link…" | `nueva-contrasena` hasta sesión lista |
| "Subiendo…" | `QuickActions` al subir foto |
| EmptyState | Cuando no hay datos (sin cultivos, sin entries...) |

No hay skeletons ni Suspense boundaries custom (solo loading.tsx de Next).

---

## 32. Responsive

### Enfoque mobile-first

La app prioriza uso en celular. Desktop agrega sidebar.

### Breakpoint principal

**768px** — usado en:
- `AppShell.module.scss`: sidebar vs bottom nav
- `Sidebar.module.scss`: visible ≥768px
- `BottomNav.module.scss`: visible <768px
- `TopNav.module.scss`: visible <768px

### Cambios por viewport

| Mobile | Desktop |
|--------|---------|
| TopNav fijo arriba | Sin TopNav |
| BottomNav fijo abajo | Sidebar izquierda |
| CultivationSectionNav dropdown | Pills horizontales |
| FAB "+" en lista cultivos | Mismo botón inline |

### Detalles CSS

- `safe-area-inset` para notch/home indicator
- `100dvh` para altura viewport
- Contenido max-width ~760px centrado
- `-webkit-tap-highlight-color: transparent` en nav

---

## 33. PWA

### Qué es una PWA

Sitio web que puede instalarse en el home screen del celular y abrirse como app (sin barra del navegador).

### Qué está implementado

| Feature | Archivo | Estado |
|---------|---------|--------|
| Manifest | `src/app/manifest.ts` | ✅ |
| Botón instalar | `InstallAppButton.tsx` | ✅ (solo en login) |
| Iconos | `/logo-ligth.png` | ✅ |
| display: standalone | manifest | ✅ |

### Qué NO está implementado

> Service worker (cache offline).
> Push notifications.
> Sync en background.

`InstallAppButton` usa `beforeinstallprompt` + `localStorage` para no mostrar de nuevo si el usuario ya clickeó.

---

## 34. Seguridad

### Auth

- Sesión en cookies manejada por Supabase SSR.
- Passwords nunca se guardan en frontend (van a Supabase Auth).

### RLS

Todas las tablas public tienen policies. Ver sección 11.

### Storage privado

Bucket `cultivation-photos` con `public: false`. Acceso via signed URLs.

### Variables de entorno

| Variable | ¿Expuesta al browser? |
|----------|----------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sí (necesaria) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí (necesaria, diseñada para eso) |
| Service role key | **NO debe existir en el frontend** |

### Qué NUNCA exponer

- `SUPABASE_SERVICE_ROLE_KEY`
- Secretos de API privados
- Passwords de usuarios

### Clave anon vs service role

La clave **anon** está pensada para el browser. La seguridad real la da **RLS**, no ocultar la clave.

---

## 35. Flujos completos para estudiar

### Crear cultivo

```text
/cultivos/nuevo
    ↓
NewCultivationForm (validación local)
    ↓
createClient() [browser]
    ↓
createCultivation → cultivations
createPlants → plants
createPeriod (opcional) → cultivation_periods
uploadPhoto → storage + cover_image_url en cultivations
    ↓
toast + redirect /cultivos/{id}
```

### Registrar día

```text
/registrar o /cultivos/{id}/registrar
    ↓
RegisterDayPage [server: carga existing, plants, genetics, signed URLs]
    ↓
DailyEntryForm [client: usuario completa]
    ↓
handleSubmit
    ↓
upsertDailyEntry → daily_entries
saveMeasurements → measurements (+ ensureCultivationGenetic)
replaceActions → actions
setEntryIrrigation → irrigations
uploadPhoto + addPhotoRecord → storage + photos
    ↓
redirect ?tab=timeline
```

### Login

```text
/login form submit
    ↓
¿username? → RPC get_email_for_username
    ↓
signInWithPassword
    ↓
cookies de sesión
    ↓
/dashboard
```

### Ver foto en timeline

```text
/cultivos/{id}?tab=timeline [server]
    ↓
getEntries (incluye photos.storage_path)
    ↓
getSignedUrlMap(paths)
    ↓
TimelineEntry renderiza <Image src={signedUrl} />
```

---

## 36. Decisiones de arquitectura

### Supabase en vez de backend propio

| | |
|--|--|
| **Alternativa** | API REST/GraphQL propia con Node/Express |
| **Por qué Supabase** | Auth + DB + Storage integrados; RLS; menos código |
| **Ventaja** | Desarrollo rápido, menos infraestructura |
| **Desventaja** | Lógica compleja en DB (RLS, triggers); vendor lock-in moderado |
| **Defensa oral** | "Para un MVP mobile-first, Supabase nos da auth y DB segura sin montar un backend. RLS protege los datos aunque el cliente llame directo." |

### PostgreSQL en vez de JSON en localStorage

| | |
|--|--|
| **Alternativa** | Guardar todo en el navegador |
| **Por qué PostgreSQL** | Datos persistentes, consultas, relaciones, multi-dispositivo |
| **Defensa oral** | "Los cultivos duran meses. Necesitamos DB real con relaciones y backup." |

### measurements separado de daily_entries

| | |
|--|--|
| **Alternativa** | Columnas temp/humidity en daily_entries |
| **Por qué separado** | Múltiples genéticas por día; borrar parámetros sin borrar el día |
| **Defensa oral** | "Un día puede tener parámetros distintos por genética. Una fila por genética es más limpio." |

### plants separado de cultivation_genetics

| | |
|--|--|
| **Alternativa** | Solo genetics en cultivations |
| **Por qué ambos** | plants = config individual; cultivation_genetics = FK estable para measurements |
| **Defensa oral** | "Las plantas son entidades del cultivador. Las genéticas en DB son para agrupar mediciones." |

### Storage en vez de imágenes en PostgreSQL

| | |
|--|--|
| **Alternativa** | BYTEA en Postgres |
| **Por qué Storage** | Optimizado para archivos; signed URLs; límites de tamaño |
| **Defensa oral** | "Las fotos van a object storage privado. En DB solo guardamos el path." |

### Next.js App Router

| | |
|--|--|
| **Alternativa** | Pages Router, Vite+React SPA |
| **Por qué App Router** | Server Components para reads; layouts anidados; routing file-based |
| **Defensa oral** | "Las páginas cargan datos en el servidor. Menos JS al cliente. Layout compartido con auth check." |

### TypeScript

| | |
|--|--|
| **Alternativa** | JavaScript puro |
| **Por qué TS** | Tipos de DB, props, union types de enums |
| **Defensa oral** | "Con 15 tablas y props complejas, TypeScript evita errores de typos en campos." |

### RLS

| | |
|--|--|
| **Alternativa** | Validar user_id en cada query del backend |
| **Por qué RLS** | Seguridad en DB aunque el frontend sea manipulado |
| **Defensa oral** | "Aunque alguien use la anon key directamente, RLS filtra por auth.uid()." |

### PWA en vez de React Native

| | |
|--|--|
| **Alternativa** | App nativa iOS/Android |
| **Por qué PWA** | Un codebase; deploy web; instalable en mobile |
| **Defensa oral** | "Somos web mobile-first. PWA permite instalar sin stores. Suficiente para el MVP." |

---

## 37. Decisiones que mantienen el proyecto simple

Growndona **deliberadamente evita**:

| No usamos | Por qué |
|-----------|---------|
| Redux / Zustand | Estado local en formularios alcanza |
| Backend separado | Supabase + RLS |
| react-hook-form / Zod | Validación manual es suficiente por ahora |
| Microservicios | Monolito Next + Supabase |
| API routes para CRUD | Cliente directo a Supabase (excepto auth/confirm) |
| Custom hooks folder | Lógica en utils y queries |
| IA / IoT | Fuera de scope del producto |
| Service worker | PWA básica sin offline |

**Defensa oral:** "Elegimos simplicidad defendible. Cada capa tiene un rol claro: pages leen, forms escriben, queries centralizan Supabase, utils calculan."

---

## 38. Cosas que parecen complejas pero son simples

### Foreign key

> Conecta una fila con otra. Ej: `daily_entries.cultivation_id` apunta a `cultivations.id`. Si borrás el cultivo, cascade borra sus entries.

### Server vs Client Component

> Server = lee DB y muestra HTML. Client = botones y formularios. En Growndona casi toda page es server; los forms son client.

### Signed URL

> Link temporal para ver un archivo privado. Growndona genera uno por foto al renderizar, dura 1 hora.

### Upsert

> Insert si no existe, update si existe. `daily_entries` usa upsert por `(cultivation_id, entry_date)` — un registro por día.

### Route group `(app)`

> Carpeta organizativa. No aparece en la URL. Solo agrupa layouts y páginas protegidas.

### genetic_id null

> No es error. Significa "parámetros generales del día", no atados a una genética específica.

---

## 39. Preguntas que podrían hacerme

### Básicas

**¿Qué es Growndona?**
> App web para registrar y seguir cultivos día a día: parámetros, riegos, acciones, fotos y problemas.

**¿Qué tecnologías usa?**
> Next.js 16, React 19, TypeScript, Supabase (Auth + PostgreSQL + Storage), SCSS, Recharts, date-fns.

**¿Cómo arranca la app?**
> `npm run dev` → Next lee `src/app/` → layout raíz con ToastProvider → rutas en `(app)` verifican auth.

**¿Qué es una ruta dinámica?**
> `[id]` captura el ID del cultivo de la URL. Ej: `/cultivos/abc-123` → params.id = "abc-123".

### Intermedias

**¿Por qué Supabase y no un backend propio?**
> Auth, DB y storage integrados. RLS protege datos. Menos código para un MVP.

**¿Cómo evitás que un usuario vea cultivos de otro?**
> Row Level Security: policies con `user_id = auth.uid()` en cultivations y helpers en tablas hijas.

**¿Por qué measurements es otra tabla?**
> Permite múltiples genéticas por día y borrar parámetros sin borrar el registro completo.

**¿Cómo funciona una signed URL?**
> El bucket es privado. El servidor pide a Supabase un link temporal (1h) para mostrar la foto.

**¿Cómo calculás el día del cultivo?**
> `differenceInCalendarDays(fecha, start_date) + 1`. Día 1 = fecha de inicio. No se guarda en DB.

**¿Qué diferencia hay entre plants y cultivation_genetics?**
> plants = cada planta individual. cultivation_genetics = nombre normalizado para vincular mediciones y gráficos.

**¿Qué pasa al guardar un registro diario?**
> Upsert en daily_entries, luego measurements/actions/irrigations/photos en paralelo secuencial.

### Difíciles

**¿Por qué hay client y server de Supabase?**
> Server lee cookies de Next para SSR. Browser mantiene sesión del usuario para formularios. Recovery usa cliente aislado.

**¿Por qué proxy.ts no protege rutas?**
> Existe la lógica pero falta middleware.ts que la exporte. Hoy protege `(app)/layout.tsx`.

**¿Cómo manejás múltiples genéticas el mismo día?**
> Una fila en measurements por genetic_id. UI agrupa con getGeneticGroups(plants). ensureCultivationGenetic crea la fila en DB al guardar.

**¿Por qué PWA y no React Native?**
> Un solo codebase web, instalable en mobile, sin pasar por app stores para el MVP.

**¿Qué pasa si falla la subida de imagen?**
> El catch del formulario muestra error genérico. La entry ya puede estar creada — operación no es transaccional atómica.

**¿Por qué no usan react-hook-form?**
> Formularios acotados con validación manual. Menos dependencias, más explícito para aprender.

---

## 40. Errores comunes al explicarlo

| ❌ Decir | ✅ Mejor |
|---------|---------|
| "Supabase es la base de datos" | "Supabase es la plataforma; PostgreSQL es la base de datos" |
| "Las fotos se guardan en la DB" | "En la DB se guarda el path; el archivo está en Storage" |
| "El middleware protege rutas" | "El layout de (app) protege rutas; proxy.ts existe pero no está conectado" |
| "Cada planta es una genética" | "Varias plantas pueden compartir genética; plants y cultivation_genetics tienen roles distintos" |
| "El día se guarda en daily_entries" | "Se guarda entry_date; el número de día se calcula con start_date" |
| "Next.js es el backend" | "Next renderiza en server y tiene un route handler de auth; los datos van a Supabase" |
| "La anon key es secreta" | "Es pública por diseño; RLS es la seguridad real" |

---

## 41. Glosario

| Término | Significado en Growndona |
|---------|-------------------------|
| **RLS** | Row Level Security — filtra filas por usuario en PostgreSQL |
| **foreign key** | Columna que referencia otra tabla (ej: cultivation_id → cultivations) |
| **primary key** | Identificador único de fila (uuid) |
| **bucket** | Contenedor de archivos en Supabase Storage |
| **signed URL** | Link temporal para archivo privado |
| **component** | Pieza de UI React (ej: DailyEntryForm) |
| **props** | Datos que recibe un componente del padre |
| **state** | Datos internos que cambian (useState) |
| **hook** | Función React que empieza con use (useState, useEffect) |
| **route** | URL mapeada a un page.tsx |
| **layout** | Wrapper compartido entre páginas |
| **migration** | SQL versionado que define/cambia el esquema DB |
| **query** | Consulta a Supabase (.from().select()) |
| **mutation** | Insert/update/delete en Supabase |
| **async/await** | Esperar operaciones asíncronas (fetch, Supabase) |
| **Server Component** | Componente que corre en servidor, puede ser async |
| **Client Component** | Componente con "use client", corre en navegador |
| **upsert** | Insert o update según conflicto |
| **route group** | Carpeta (app) que no afecta la URL |

---

## 42. Qué debería estudiar primero

Ruta de aprendizaje en sesiones de 15–30 minutos.

### Día 1 — Visión general
- Secciones 1, 2, 4 de esta guía
- Leer `README.md`
- Explorar `src/app/` y `package.json`

### Día 2 — Rutas y layouts
- Secciones 3, 5, 6
- Abrir `(app)/layout.tsx`, `dashboard/page.tsx`, `cultivos/[id]/page.tsx`
- Probar navegación en `npm run dev`

### Día 3 — Supabase y DB
- Secciones 9, 11, 12
- Leer migrations 0001, 0002, 0006, 0007
- Revisar `src/types/database.ts`

### Día 4 — Autenticación
- Sección 10
- Leer login, register, auth/confirm
- Probar registro y login local

### Día 5 — Cultivos
- Secciones 13, 14
- Seguir `NewCultivationForm.tsx` y `PlantsSection.tsx`
- Crear un cultivo de prueba

### Día 6 — Registro diario
- Secciones 15, 16, 18, 19
- Seguir flujo completo en `DailyEntryForm.tsx` y `entries.ts`
- Registrar un día con parámetros, riego y foto

### Día 7 — Timeline, gráficos, galería
- Secciones 22, 23, 24, 25
- Ver `TimelineEntry`, `MeasurementChart`, tab galeria

### Día 8 — TypeScript y React
- Secciones 27, 28, 29
- Identificar tipos y hooks en archivos ya conocidos

### Día 9 — Seguridad y arquitectura
- Secciones 34, 36, 37
- Preparar respuestas orales de sección 39

### Día 10 — Repaso
- Checklist sección 43
- Simular preguntas en voz alta

---

## 43. Checklist de dominio del proyecto

- [ ] Puedo explicar qué problema resuelve Growndona
- [ ] Puedo describir la estructura de carpetas
- [ ] Puedo listar las rutas principales y cuáles requieren login
- [ ] Puedo explicar Server vs Client Components con ejemplos
- [ ] Puedo explicar el flujo de login (email y username)
- [ ] Puedo explicar qué es RLS y dar un ejemplo con cultivations
- [ ] Puedo dibujar el esquema de tablas principales
- [ ] Puedo explicar cómo se crea un cultivo (tablas tocadas)
- [ ] Puedo explicar la diferencia entre plants y cultivation_genetics
- [ ] Puedo recorrer el flujo de registro diario paso a paso
- [ ] Puedo explicar por qué measurements está separado
- [ ] Puedo explicar cómo se sube y muestra una foto
- [ ] Puedo explicar cómo se construye el timeline
- [ ] Puedo explicar de dónde salen los datos del dashboard
- [ ] Puedo explicar cómo se calcula "Día X"
- [ ] Puedo explicar buildGeneticSeries para gráficos
- [ ] Puedo explicar por qué usamos TypeScript
- [ ] Puedo explicar los tres clientes de Supabase
- [ ] Puedo defender por qué Supabase en vez de backend propio
- [ ] Puedo identificar qué NO está implementado (modo avanzado, service worker, etc.)
- [ ] Puedo explicar la navegación mobile vs desktop
- [ ] Puedo explicar el flujo de problemas (activo → resuelto)

---

## 44. Cosas que todavía no entiendo

Agregar acá dudas mientras estudio:

-

---

## Complejidad a revisar

Casos detectados en el código. **No modificar sin evaluar riesgo.**

### `Database` con `TableDef` genérico

| | |
|--|--|
| **Archivo** | `src/types/database.ts` |
| **Qué lo hace difícil** | Tipos genéricos con Insert/Update/Relationships |
| **Por qué simplificar** | Tipos planos por tabla serían más legibles |
| **Riesgo de simplificar** | Perder autocomplete preciso en inserts de Supabase |

### `proxy.ts` sin conectar

| | |
|--|--|
| **Archivo** | `src/proxy.ts` |
| **Qué lo hace difícil** | Parece que hay middleware pero no funciona |
| **Por qué simplificar** | Conectar como middleware.ts o eliminar |
| **Riesgo** | Sin middleware, usuarios logueados pueden ver /login (no redirect automático) |

### Guardado no transaccional en DailyEntryForm

| | |
|--|--|
| **Archivo** | `src/components/entries/DailyEntryForm.tsx` |
| **Qué lo hace difícil** | Si falla upload de foto, la entry ya existe |
| **Por qué simplificar** | Transacción o rollback manual |
| **Riesgo** | Más complejidad; Supabase client no tiene transacciones multi-tabla nativas fáciles |

### Funciones query sin usar

| | |
|--|--|
| **Archivos** | `entries.ts`: `getLatestEntry`, `deleteEntry`; `photos.ts`: `getCultivationPhotos` |
| **Qué lo hace difícil** | Código muerto confunde al leer |
| **Por qué simplificar** | Eliminar o usar |
| **Riesgo** | Bajo si realmente no se referencian |

### Tipos duplicados entre DB y forms

| | |
|--|--|
| **Archivos** | `PlantsSection.tsx` (`PlantDraft`) vs `database.ts` (`Plant`) |
| **Qué lo hace difícil** | Dos representaciones de planta |
| **Por qué simplificar** | Un solo tipo con mapper |
| **Riesgo** | PlantDraft incluye campos temporales de UI que Plant no tiene |

---

## Mantenimiento de la guía

Cuando pidas **"Actualizá la guía de estudio"**:

1. Revisar cambios recientes del proyecto (git diff, archivos nuevos).
2. Identificar qué secciones afecta cada cambio.
3. Actualizar solo esas secciones.
4. Agregar conceptos nuevos si aparecen.
5. Marcar obsoleto lo que ya no exista.
6. Actualizar preguntas del banco (sección 39) y checklist (sección 43).

No reescribir el documento completo en cada actualización.

---

*Última revisión basada en el código del repositorio Growndona — agosto 2026.*
