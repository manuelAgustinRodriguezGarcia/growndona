# Daily Entry Params Row Layout

## Goal

Put the five measurement inputs in `DailyEntryForm` on one horizontal row with short labels and narrow fields. No default value prefill.

## Scope

In scope:

- Compact labels: `Temp.`, `Hum.`, `pH`, `EC (µS/cm)`, `PPM`
- Single-row layout with fixed narrow widths
- Horizontal scroll on small screens when the row overflows
- EC unit shown as µS/cm; validation max raised to match µS/cm scale

Out of scope:

- Prefilling demo values
- Changing save/query logic beyond EC range validation
- Redesigning other form sections

## UI

`paramsGrid` becomes a horizontal flex/grid row:

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

- `src/components/entries/DailyEntryForm.module.scss` — row layout
- `src/components/entries/DailyEntryForm.tsx` — short label usage; EC range
- `src/lib/utils/labels.ts` — short labels + EC unit/decimals

## Acceptance

1. All five inputs render on one row on desktop and mobile (scroll if needed).
2. Labels match the compact set above.
3. Empty form still starts blank; existing measurements still load when editing.
4. EC accepts values like 534 without failing validation.
