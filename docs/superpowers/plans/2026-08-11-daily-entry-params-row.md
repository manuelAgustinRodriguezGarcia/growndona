# Daily Entry Params Row Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flatten DailyEntryForm section cards and put the five measurement inputs on one compact horizontal row with short labels and µS/cm EC scale.

**Architecture:** Keep section markup in `DailyEntryForm` but replace shared card-styled `formStyles.block` with a local unstyled section class so only this form loses border/padding/background. Extend `MEASUREMENT_FIELDS` with `shortLabel` for form display, update EC unit/decimals, tighten `paramsGrid` into a fixed-width scrollable row, and raise the EC validation max to 10000.

**Tech Stack:** Next.js 16, React 19, Sass modules, TypeScript

## Global Constraints

- Compact labels exactly: `Temp.`, `Hum.`, `pH`, `EC (µS/cm)`, `PPM`
- No value prefill; blank form stays blank; existing measurements still load when editing
- Do not change `.block` card styling in `src/styles/form.module.scss` (other forms keep cards)
- No code comments
- Spec: `docs/superpowers/specs/2026-08-11-daily-entry-params-row-design.md`

---

## File Map

| File | Responsibility |
|------|----------------|
| `src/lib/utils/labels.ts` | `shortLabel` on measurement fields; EC unit `µS/cm`; EC decimals `0` |
| `src/components/entries/DailyEntryForm.tsx` | Use local section class; render `shortLabel`; EC range `0–10000` |
| `src/components/entries/DailyEntryForm.module.scss` | Unstyled `.section`; compact `.paramsGrid` row |

This repo has no unit-test runner. Verify with `npx tsc --noEmit`, `npm run lint`, and a manual UI checklist on `/cultivos/[id]/registrar`.

---

### Task 1: Measurement short labels and EC unit

**Files:**
- Modify: `src/lib/utils/labels.ts:70-81`
- Verify: `formatMeasurement` call sites keep working via typecheck

**Interfaces:**
- Consumes: existing `MeasurementKey`, `MEASUREMENT_FIELDS`, `formatMeasurement`
- Produces: each `MEASUREMENT_FIELDS` item has `shortLabel: string`; EC has `unit: "µS/cm"`, `decimals: 0`

- [ ] **Step 1: Update `MEASUREMENT_FIELDS` type and values**

Replace the `MEASUREMENT_FIELDS` declaration with:

```ts
export const MEASUREMENT_FIELDS: {
  key: MeasurementKey;
  label: string;
  shortLabel: string;
  unit: string;
  decimals: number;
}[] = [
  { key: "temperature", label: "Temperatura", shortLabel: "Temp.", unit: "°C", decimals: 1 },
  { key: "humidity", label: "Humedad", shortLabel: "Hum.", unit: "%", decimals: 0 },
  { key: "ph", label: "pH", shortLabel: "pH", unit: "", decimals: 1 },
  { key: "ec", label: "EC", shortLabel: "EC (µS/cm)", unit: "µS/cm", decimals: 0 },
  { key: "ppm", label: "PPM", shortLabel: "PPM", unit: "", decimals: 0 },
];
```

Leave `formatMeasurement` unchanged; it continues to use `label`/`unit`/`decimals`.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`  
Expected: PASS (no errors about missing `shortLabel` yet — consumers of the array that destructure only known fields still typecheck; form update is Task 2)

- [ ] **Step 3: Commit**

```bash
git add src/lib/utils/labels.ts
git commit -m "Add short measurement labels and EC in µS/cm"
```

---

### Task 2: Flatten DailyEntryForm sections

**Files:**
- Modify: `src/components/entries/DailyEntryForm.module.scss`
- Modify: `src/components/entries/DailyEntryForm.tsx` (all `formStyles.block` wrappers)

**Interfaces:**
- Consumes: `formStyles.form`, `formStyles.blockTitle` still from shared form styles
- Produces: local `styles.section` with no background, border, radius, or padding

- [ ] **Step 1: Add unstyled section class**

In `DailyEntryForm.module.scss`, add:

```scss
.section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
```

Do not edit `src/styles/form.module.scss`.

- [ ] **Step 2: Swap section wrappers in the form**

In `DailyEntryForm.tsx`, replace every:

```tsx
<div className={formStyles.block}>
```

with:

```tsx
<div className={styles.section}>
```

Keep `formStyles.form` on `<form>` and keep `formStyles.blockTitle` on section titles. There are five blocks: date, parámetros, acciones, fotos, notas.

- [ ] **Step 3: Manual check**

Run: `npm run dev`  
Open a cultivation registrar page.  
Expected: date / parámetros / acciones / fotos / notas have no card border or padded surface; spacing comes from form gap only. Other forms (nuevo cultivo, login) still show cards.

- [ ] **Step 4: Commit**

```bash
git add src/components/entries/DailyEntryForm.tsx src/components/entries/DailyEntryForm.module.scss
git commit -m "Flatten DailyEntryForm section cards"
```

---

### Task 3: Compact params row and EC range

**Files:**
- Modify: `src/components/entries/DailyEntryForm.module.scss` (`.paramsGrid`)
- Modify: `src/components/entries/DailyEntryForm.tsx` (params `Input` labels + `RANGES.ec`)

**Interfaces:**
- Consumes: `MEASUREMENT_FIELDS[].shortLabel` from Task 1; `styles.section` from Task 2
- Produces: five inputs in one scrollable row; EC validates `0–10000`

- [ ] **Step 1: Replace `.paramsGrid` styles**

Replace the existing `.paramsGrid` block with:

```scss
.paramsGrid {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;

  > * {
    flex: 0 0 auto;
  }

  > *:nth-child(1),
  > *:nth-child(2),
  > *:nth-child(5) {
    width: 64px;
  }

  > *:nth-child(3) {
    width: 52px;
  }

  > *:nth-child(4) {
    width: 88px;
  }
}
```

- [ ] **Step 2: Use short labels and raise EC max**

In `DailyEntryForm.tsx`, change `RANGES.ec` to:

```ts
ec: { min: 0, max: 10000 },
```

In the parámetros map, change the `Input` `label` prop from:

```tsx
label={field.unit ? `${field.label} (${field.unit})` : field.label}
```

to:

```tsx
label={field.shortLabel}
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc --noEmit`  
Expected: PASS  

Run: `npm run lint`  
Expected: PASS (or only pre-existing unrelated warnings)

- [ ] **Step 4: Manual UI checklist**

On `/cultivos/[id]/registrar`:

1. Labels show exactly: Temp. · Hum. · pH · EC (µS/cm) · PPM
2. All five inputs sit on one row; narrow widths; horizontal scroll if needed on small width
3. Enter EC `534` and save (or attempt submit) — no “debe estar entre 0 y 20” error
4. Sections still flat (no cards)
5. Empty fields stay empty when there is no existing entry

- [ ] **Step 5: Commit**

```bash
git add src/components/entries/DailyEntryForm.tsx src/components/entries/DailyEntryForm.module.scss
git commit -m "Compact daily entry params into one scrollable row"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|------------------|------|
| Flatten DailyEntryForm sections (no border/padding/surface) | Task 2 |
| Other forms keep `.block` cards | Task 2 (no edit to `form.module.scss`) |
| Compact short labels | Task 1 + Task 3 |
| Single-row fixed narrow widths + overflow scroll | Task 3 |
| EC µS/cm + range 0–10000 | Task 1 + Task 3 |
| No value prefill | All tasks (no initial-value changes) |
