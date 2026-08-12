# Mobile Top Nav Brand Bar

## Goal

Add a mobile-only top brand bar with the Growndona logo and wordmark. Desktop layout stays unchanged (sidebar + no top bar).

## Decisions

- Scope: branding only (logo + GROWNDONA). No nav links.
- Viewport: mobile only (`< 768px`). Hidden on desktop.
- Typography: Comfortaa (matches rounded logo geometry).
- Background: `#052911`. Text/logo: white.
- Brand block links to `/dashboard`.
- BottomNav remains the primary mobile navigation.

## Structure

- New component: `src/components/layout/TopNav.tsx` + `TopNav.module.scss`
- Mounted in `AppShell` above `main`
- CSS variable `--top-nav-height` for content offset
- Comfortaa via `next/font/google`, applied only to TopNav

## UI

- Fixed bar at top with safe-area inset
- Left: `public/logo.png` + large wordmark `GROWNDONA`
- Height ~56–64px plus safe area
- `main` gains top padding on mobile equal to `--top-nav-height`

## Out of scope

- Auth pages
- Desktop sidebar brand changes
- Menu links in the top bar
