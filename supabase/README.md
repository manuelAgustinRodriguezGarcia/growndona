# Configuración de Supabase para Growndona

## 1. Crear el proyecto

1. Entrar a [supabase.com](https://supabase.com) y crear un proyecto nuevo.
2. Guardar la contraseña de la base de datos (no se usa en la app, pero la vas a necesitar para administrar).
3. En **Project Settings → API** copiar:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Ejecutar migrations (en orden)

Abrir **SQL Editor** en el dashboard y ejecutar el contenido de cada archivo, en este orden exacto:

1. `migrations/0001_schema.sql` — tablas, foreign keys con cascade delete, índices, triggers (`updated_at` y creación automática de `profiles` al registrarse un usuario).
2. `migrations/0002_rls.sql` — activa Row Level Security en todas las tablas y crea las policies. Un usuario solo puede leer/crear/modificar/eliminar datos de sus propios cultivos.
3. `migrations/0003_storage.sql` — crea el bucket `cultivation-photos` (privado, 5 MB máximo, solo JPG/JPEG/PNG/WEBP) y sus policies de storage.

Si preferís usar la CLI de Supabase, los archivos también funcionan con `supabase db push` colocándolos en `supabase/migrations/`.

## 3. Storage

El bucket `cultivation-photos` queda creado por `0003_storage.sql`. Es **privado**: la app genera signed URLs para mostrar las imágenes.

Estructura de archivos:

```
{userId}/{cultivationId}/{entryId}/{filename}          fotos de registros diarios
{userId}/{cultivationId}/problems/{problemId}/{file}   fotos de problemas
{userId}/{cultivationId}/cover/{filename}              portada del cultivo
{userId}/avatar/{filename}                             avatar del perfil
```

Las policies de storage solo permiten a cada usuario acceder a archivos cuya primera carpeta coincida con su propio `auth.uid()`.

## 4. Autenticación

- La app usa email + contraseña (Supabase Auth).
- En **Authentication → URL Configuration** configurar `Site URL` (por ejemplo `http://localhost:3000` en desarrollo).
- Si la confirmación por email está activada (viene activada por defecto), el link de confirmación pasa por la ruta `/auth/confirm` de la app, que ya está implementada. Para desarrollo podés desactivar **Confirm email** en Authentication → Sign In / Providers → Email y así entrar directamente después de registrarte.

## 5. Variables de entorno

Copiar `.env.example` a `.env.local` en la raíz del repo y completar:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 6. Datos demo (opcional)

`seed.sql` crea un cultivo "Orbiter #1" con períodos, 14 días de registros, parámetros, riegos, acciones y problemas.

1. Registrá un usuario desde la app (o creá uno en Authentication → Users).
2. Copiá su ID.
3. En `seed.sql` reemplazá `REPLACE_WITH_USER_ID` por ese uuid.
4. Ejecutá el archivo en el SQL Editor.

La app funciona perfectamente sin el seed.
