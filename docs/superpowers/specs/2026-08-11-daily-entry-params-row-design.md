# Daily Entry Params Row Layout

## Goal

Flatten `DailyEntryForm` sections (no nested card containers) and put the five measurement inputs on one horizontal row with short labels and narrow fields. No default value prefill.

## Scope

In scope:

- Remove card chrome from DailyEntryForm section wrappers: no background, border, border-radius, or padding on those blocks
- Form (`form.form`) is the only layout parent; sections stack with the form gap
- Compact labels: `Temp.`, `Hum.`, `pH`, `EC (µS/cm)`, `PPM`
- Single-row layout with fixed narrow widths
- Horizontal scroll on small screens when the row overflows
- EC unit shown as µS/cm; validation max raised to match µS/cm scale

Out of scope:

- Prefilling demo values
- Changing save/query logic beyond EC range validation
- Changing `.block` card styling on other forms (Profile, Cultivation, Problems, etc.)

## UI — form sections

In `DailyEntryForm` only:

- Stop using shared card-styled `formStyles.block` for section wrappers, or override with a local unstyled section class
- Keep section titles (`Parámetros`, `Acciones del día`, `Fotos`, `Notas`)
- Spacing between sections comes from `.form { gap }` (and small internal gaps for fields), not from padded bordered boxes
- Date row, params, actions, photos, notes, and save bar sit directly in the form flow

## UI — params row

`paramsGrid` becomes a horizontal flex row:

| Field | Label | Approx width |
|-------|-------|--------------|
| temperature | Temp. | 64px |
| humidity | Hum. | 64px |
| ph | pH | 52px |
| ec | EC (µS/cm) | 88px |
| ppm | PPM | 64px |

- Gap ~6–8px
- `overflow-x: auto` so mobile can scroll
- Inputs stay readable; labels may wrap to two lines for EC only

## Data / labels

- Add `shortLabel` on each `MEASUREMENT_FIELDS` entry for form display
- Keep `label`, `unit`, and `decimals` for timeline and formatting elsewhere
- EC: unit `µS/cm`, decimals `0`, form range `0–10000`
- Form renders `shortLabel` only (no extra unit suffix)

## Files

- `src/components/entries/DailyEntryForm.module.scss` — row layout + unstyled sections
- `src/components/entries/DailyEntryForm.tsx` — short labels; EC range; section class usage
- `src/lib/utils/labels.ts` — short labels + EC unit/decimals

## Acceptance

1. DailyEntryForm sections have no border, padding box, or surface card around them; the form is the visual container.
2. Other forms that use `form.module.scss` `.block` keep their current card look.
3. All five inputs render on one row on desktop and mobile (scroll if needed).
4. Labels match the compact set above.
5. Empty form still starts blank; existing measurements still load when editing.
6. EC accepts values like 534 without failing validation.
