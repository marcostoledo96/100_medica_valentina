# Vitales Specification

## Purpose

Isolated, reusable presentation module for Issue #10's clinical-parody vital-sign statistics (RF-004). It renders typed `Stat` data — `number`, `percentage`, `text`, `progress` — as a mobile-first card grid with centralized formatting, accessible semantics, visible humor disclosure, and deterministic final-value rendering. Phase A ships the feature module only; application integration is a later, separately authorized phase.

Data contract: `Stat`, `StatFormat`, and `StatCollection` are defined and validated by the existing Zod schema at `src/domain/schemas/stats.schema.ts` (re-exported as domain types). This change MUST NOT modify that schema. No component imports `src/content/**`; all data arrives through typed props.

## Requirements

### Requirement: Typed stats supplied through props

`VitalSigns` MUST accept the stats to render as a `readonly Stat[]` prop typed from the existing domain schema, and MUST NOT import `src/content/**` modules (including `statsContent`), application shell state, section registries, navigation, or experience-phase state. All displayed data MUST flow through props.

#### Scenario: Renders supplied stats without content dependency

- GIVEN a schema-validated synthetic fixture collection containing stats in several formats
- WHEN `VitalSigns` is rendered with that collection
- THEN every supplied stat appears in the output
- AND the feature module contains no import of any `src/content/**` module, `App`, `NarrativeShell`, section registry, navigation, or experience-phase module

### Requirement: Input order preserved and input not mutated

`VitalSigns` MUST render stats in the order they appear in the input array and MUST NOT mutate, reorder, filter, or otherwise modify its input.

#### Scenario: Order preserved

- GIVEN a collection of at least three stats with distinct labels in a known order
- WHEN `VitalSigns` renders
- THEN the resulting cards appear in the same order as the input array

#### Scenario: Input array unchanged

- GIVEN a stats array captured before render
- WHEN `VitalSigns` renders with it
- THEN the array contents and order are identical after rendering

### Requirement: Semantic section with heading and mobile-first grid

`VitalSigns` MUST render as a semantic section whose accessible name comes from a heading. The card grid MUST be mobile-first: one column at compact mobile widths, expanding to at most two columns at the project's small-screen breakpoint (≥640px), and MUST NOT produce horizontal overflow anywhere in the 360–430px target viewport range.

#### Scenario: Section heading association

- GIVEN `VitalSigns` rendered with its default or supplied heading
- THEN the section's accessible name is the heading text (e.g., associated via `aria-labelledby`)

#### Scenario: Grid contract across target widths

- GIVEN the section rendered at a compact mobile width (e.g., 360px)
- THEN cards lay out in a single column with no horizontal overflow
- WHEN the viewport is at or above the small-screen breakpoint (640px)
- THEN the grid expands to at most two columns without horizontal overflow

### Requirement: StatCard value rendering per format

`StatCard` MUST render one typed `Stat` as a non-interactive, accessible card whose visible value follows the stat's `format`:

- A string value MUST render exactly as supplied for any format — never numerically reformatted.
- A numeric value in `number` or `percentage` format MUST be localized for the Spanish/Argentine presentation context (e.g., `1200` renders as `1.200`).
- When a stat has a `unit`, it MUST be composed with the formatted value exactly once, with consistent separation; components MUST NOT implement their own spacing or punctuation logic (composition is centralized in the presentation module).

#### Scenario: Number format with numeric value

- GIVEN a schema-validated stat with `format: 'number'` and numeric value `1200`
- WHEN rendered
- THEN the visible value is the localized form `1.200`

#### Scenario: Number format with unit composition

- GIVEN a `number` stat with numeric value `1200` and unit `hs`
- WHEN rendered
- THEN the visible value reads `1.200 hs` — the unit composed once with consistent separation and no duplicated punctuation

#### Scenario: Percentage format renders as supplied

- GIVEN a `percentage` stat whose value is the string `99.9%`
- WHEN rendered
- THEN the visible value is exactly `99.9%`

#### Scenario: Text format renders value unchanged

- GIVEN a `text` stat whose value is any nonempty string
- WHEN rendered
- THEN the visible value is exactly that string, with no numeric reformatting or truncation

### Requirement: Numeric progress semantics

For a `progress` stat with a numeric value, `StatCard` MUST clamp the value to the supported 0–100 range (inclusive) and use the clamped value for the displayed numeric text, the bar width, and the ARIA value. The bar MUST be a lightweight CSS representation (no chart package). The progress element MUST expose `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow` equal to the clamped value, and an accessible name derived from the stat label.

#### Scenario: In-range progress

- GIVEN a `progress` stat with numeric value `100` and unit `%`
- WHEN rendered
- THEN the composed visible value, bar width, and `aria-valuenow` all reflect `100`, with `aria-valuemin="0"` and `aria-valuemax="100"`

#### Scenario: Out-of-range progress clamped

- GIVEN a `progress` stat with numeric value `250` and another with numeric value `-5`
- WHEN rendered
- THEN the displayed text, bar width, and `aria-valuenow` reflect `100` for the first and `0` for the second, with `aria-valuemin="0"` and `aria-valuemax="100"`

### Requirement: Nonnumeric progress fallback

For a `progress` stat whose value is a schema-valid nonnumeric string, `StatCard` MUST render the value visibly as text exactly as supplied, and MUST NOT render `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, or `aria-valuemax`, and MUST NOT fabricate a numeric percentage.

#### Scenario: String progress degrades to text

- GIVEN a `progress` stat whose value is a nonnumeric string
- WHEN rendered
- THEN the value text is visible exactly as supplied
- AND no progressbar role or `aria-value*` attributes exist for that card
- AND no invented numeric percentage is shown

### Requirement: Optional note rendering

When a stat has `note`, `StatCard` MUST render it as visible supporting text associated with that card. When `note` is absent, the card MUST NOT render a note element or placeholder.

#### Scenario: Note present

- GIVEN a stat with a `note` string
- WHEN its card renders
- THEN the note text is visible as supporting content of that card

#### Scenario: Note absent

- GIVEN a stat without `note`
- WHEN its card renders
- THEN no note element or placeholder appears on the card

### Requirement: Visible humor disclosure independent of color

For every stat with `humorous: true`, `StatCard` MUST include a visible Spanish parody disclosure (e.g., a text badge) whose copy comes from the centralized presentation module, and the parody signal MUST NOT rely on color alone. Stats without `humorous` (or with it `false`) MUST NOT render the parody disclosure.

#### Scenario: Humorous stat shows text disclosure

- GIVEN a stat with `humorous: true`
- WHEN its card renders
- THEN the card contains visible Spanish parody-indicating text discoverable by its text content, not by color alone

#### Scenario: Non-humorous stat has no disclosure

- GIVEN an otherwise identical stat without `humorous`
- WHEN its card renders
- THEN no parody disclosure appears on the card

### Requirement: Semantic associations

Each stat MUST be rendered as an `article` whose accessible name is the stat's label (associated via `aria-labelledby` pointing at the label heading). A numeric progress element's accessible name MUST derive from the stat's label. Cards MUST be non-interactive: no focusable controls, no positive `tabindex`.

#### Scenario: Card accessible name from label

- GIVEN a stat labeled `Horas de estudio`
- WHEN its card renders
- THEN the card's accessible name is `Horas de estudio` via `aria-labelledby` referencing the label heading

#### Scenario: Progress accessible name

- GIVEN a numeric `progress` stat labeled `Recuperación de energía`
- WHEN its card renders
- THEN the progressbar's accessible name derives from that label and carries valid `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`

### Requirement: Immediate final values without animation state

The module MUST NOT implement count-up behavior, animation hooks, requestAnimationFrame, timers, or animation-owned visibility. Every value and supporting content MUST be present in the initial DOM in final form, without waiting for effects, transitions, or animation state. Rendering MUST be identical when `prefers-reduced-motion: reduce` is active.

#### Scenario: Final value immediately in normal mode

- GIVEN any schema-valid stat
- WHEN `VitalSigns`/`StatCard` first render
- THEN the final formatted value and all supporting content are already present and visible in the DOM, with no intermediate or pending animation state

#### Scenario: Reduced motion renders identical content

- GIVEN the environment reports `prefers-reduced-motion: reduce`
- WHEN the section renders
- THEN all values, notes, badges, and labels are visible and identical to normal-mode output

### Requirement: Centralized typed presentation module

Format labels, value formatting and localization, unit composition, progress resolution, visual format metadata, and humor-disclosure copy MUST be centralized in one feature-local, pure, typed module (`src/features/vitales/statPresentation.ts`) whose format mapping is exhaustively typed over `StatFormat` (all four keys present). Components MUST delegate these decisions to the module rather than reimplementing them in JSX branches. The module MUST have no DOM, side-effect, or component dependencies.

#### Scenario: Exhaustive format mapping

- GIVEN the presentation module's format map
- THEN it declares exactly the four `StatFormat` keys — `number`, `percentage`, `text`, `progress` — and exhaustiveness is enforced by the type system (e.g., `Record<StatFormat, ...>` / `satisfies`)

#### Scenario: Components delegate presentation decisions

- GIVEN a rendered stat of any format
- THEN the card's visible copy, numeric text, unit composition, and progress resolution match the output of the presentation module's pure helpers for that stat

### Requirement: No chart dependency, listeners, observers, or timers

The feature MUST NOT add a runtime dependency, chart system (chart package, SVG chart library, or canvas), event listener, MutationObserver, IntersectionObserver, ResizeObserver, interval, timeout, or requestAnimationFrame. Progress bars MUST be plain CSS-styled elements.

#### Scenario: CSS-only progress bar

- GIVEN a numeric `progress` stat
- WHEN rendered
- THEN the bar is a plain CSS-styled element whose width reflects the clamped value, with no canvas, SVG chart library, or added package involved

#### Scenario: No background activity registered

- WHEN the section mounts and renders
- THEN the feature registers no listener, observer, timer, or animation frame

### Requirement: Phase A isolation boundaries

Phase A changes MUST be confined to new files under `src/features/vitales/**` (container, card, presentation module, barrel, and tests). The module MUST NOT be integrated into `App`, `NarrativeShell`, section registries, navigation, or experience-phase orchestration, and MUST NOT be rendered by the application in this phase. The following MUST remain unmodified: protected paths (`src/App.tsx`, `src/App.test.tsx`, `src/content/sections.ts`, `src/content/sections.test.ts`, `src/components/layout/**`, `src/hooks/useActiveSection*`, `src/features/expediente/**`, `src/features/gallery/**`), plus `src/content/stats.ts`, `src/domain/**`, package manifests, design tokens, and Tailwind configuration. No new dependency may be added.

#### Scenario: Feature renders in isolation

- GIVEN only the new `src/features/vitales/**` files
- WHEN `VitalSigns` renders in a test with synthetic props
- THEN it renders correctly with no import of shell, content, registry, or newly added packages

#### Scenario: Protected and content files untouched

- WHEN Phase A completes
- THEN `src/content/stats.ts`, `src/domain/schemas/stats.schema.ts`, every protected path, package manifests, design tokens, and Tailwind configuration are unchanged (all modifications confined to `src/features/vitales/**`)

### Requirement: Synthetic local test fixtures

Tests for this module MUST define local synthetic fixtures validated against the existing `StatCollectionSchema`/`StatSchema` from `src/domain/schemas/stats.schema.ts`, covering all four formats plus humor, note, and edge variants (out-of-range and nonnumeric progress). Tests MUST NOT depend on `src/content/stats.ts` and MUST NOT add entries to it.

#### Scenario: Schema-validated local fixtures cover all formats

- GIVEN a test-local fixture collection parsed through `StatCollectionSchema`
- WHEN the component suites render it
- THEN all four formats (`number`, `percentage`, `text`, `progress`) are exercised, including humorous and non-humorous, noted and noteless variants

#### Scenario: No reliance on shipped content

- WHEN the test suites run
- THEN they pass using only their local fixtures, with `src/content/stats.ts` unchanged
