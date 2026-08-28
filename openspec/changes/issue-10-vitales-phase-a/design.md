# Design — Issue #10 Vital Signs, Phase A

Change: `issue-10-vitales-phase-a`  
Status: designed  
Artifact store: OpenSpec

## 1. Design objective

Implement the smallest isolated React presentation module that satisfies the Vitales specification without making it reachable from the application. The module receives `readonly Stat[]`, renders a semantic clinical-parody dashboard, centralizes every format decision in pure helpers, and performs no asynchronous or motion-related work.

This design keeps the existing schema and content unchanged. All production and test changes are confined to new files under `src/features/vitales/**`; protected paths, Issues #6/#11 areas, package manifests, tokens, and Tailwind configuration remain untouched.

## 2. Architectural decisions

### 2.1 Feature-local, prop-driven boundary

`VitalSigns` is the only public container. It imports the domain `Stat` type and feature-local modules, but no content, shell, navigation, section registry, phase-state, or application module.

```ts
export interface VitalSignsProps {
  stats: readonly Stat[];
  heading?: string;
  className?: string;
}

export function VitalSigns(props: VitalSignsProps): JSX.Element;
```

The component iterates with `stats.map(...)` directly. It does not copy, sort, filter, normalize, or write to the array or its entries. This preserves caller order and makes the readonly contract meaningful at both the type and runtime boundaries.

### 2.2 Semantic section, list, and cards

The rendered hierarchy is:

```text
section (accessible name from h2)
├── h2
└── ul (one-column/two-column grid)
    └── li
        └── article StatCard (accessible name from h3 stat label)
```

`VitalSigns` uses React `useId()` only to create a collision-safe heading association. `StatCard` uses `useId()` for its label association. `useId()` introduces no state transition, effect, listener, timer, or animation lifecycle.

`StatCard` is non-interactive and accepts exactly one typed stat:

```ts
export interface StatCardProps {
  stat: Stat;
}

export function StatCard(props: StatCardProps): JSX.Element;
```

It has no click handler, focus behavior, control, or `tabindex`.

### 2.3 Centralized exhaustive presentation policy

`statPresentation.ts` is the single policy module. It has no React, DOM, browser-global, content, or side-effect dependency. It imports only `Stat` and `StatFormat` types.

The exported map has exactly the four schema formats and is checked exhaustively:

```ts
interface StatFormatPresentation {
  label: string;
  badgeClassName: string;
  valueClassName: string;
}

export const statPresentation = {
  defaultHeading: 'Signos vitales',
  humorDisclosure: 'Dato en modo parodia',
  formats: {
    number: {/* ... */},
    percentage: {/* ... */},
    text: {/* ... */},
    progress: {/* ... */},
  },
} as const satisfies {
  defaultHeading: string;
  humorDisclosure: string;
  formats: Record<StatFormat, StatFormatPresentation>;
};
```

The format label is visible clinical metadata on each card. The humor disclosure is separate visible text, not an icon or color convention.

The pure helper contract is:

```ts
export interface NumericProgress {
  value: number; // clamped to 0..100
  width: `${number}%`; // derived from the same clamped value
}

export function formatStatValue(stat: Stat): string;
export function composeValueWithUnit(value: string, unit?: string): string;
export function resolveNumericProgress(stat: Stat): NumericProgress | null;
export function getVisibleStatValue(stat: Stat): string;
```

Rules:

1. String values are returned unchanged by `formatStatValue`, for every format.
2. Numeric values use one module-level `Intl.NumberFormat('es-AR')` instance.
3. Numeric progress is clamped before formatting; the displayed value, width, and ARIA value all consume the same resolved result.
4. `composeValueWithUnit` is the only unit-composition function. It appends one separating space when needed and avoids appending an identical unit already present as the value suffix, so values such as `99.9%` do not become `99.9% %`.
5. Nonnumeric progress returns `null` from `resolveNumericProgress`; it remains visible text and gains no numeric semantics.
6. Components never duplicate localization, clamping, unit, format-label, or humor-copy logic.

### 2.4 Numeric progress without a chart system

For numeric progress, `StatCard` renders a plain block element with:

- `role="progressbar"`;
- `aria-labelledby` referencing the stat-label heading;
- `aria-valuemin={0}`;
- `aria-valuemax={100}`;
- `aria-valuenow={progress.value}`.

The track and fill use existing Tailwind token utilities. The fill receives only the data-driven inline CSS declaration `style={{ width: progress.width }}`. This inline width is numeric state representation, not a new visual token. No arbitrary colors, custom CSS file, SVG, canvas, or package is introduced.

For string progress, neither the progressbar element nor any `aria-value*` attribute is rendered. The supplied string and optional unit are shown through the normal value path without parsing or coercion.

### 2.5 Zero animation and zero background activity

The module deliberately contains no count-up implementation and no motion branch. Production files must not import or call:

- `useState`, `useEffect`, or `useLayoutEffect`;
- `requestAnimationFrame`;
- `setTimeout` or `setInterval`;
- `addEventListener`;
- `MutationObserver`, `IntersectionObserver`, or `ResizeObserver`;
- an animation or chart library.

All labels, values, notes, disclosures, and progress widths are computed during render and exist in the first committed DOM. The implementation does not need to query `prefers-reduced-motion`: with no motion-owned state, normal and reduced-motion modes follow the same render path. Existing global token behavior may reduce unrelated CSS transition durations, but this feature adds no transition dependency.

## 3. Data flow

```text
Future integration owner / isolated test fixture
  │ readonly Stat[] prop
  ▼
VitalSigns
  │ direct map in caller order; no transformation or mutation
  ▼
StatCard(stat)
  ├── statPresentation.formats[stat.format]
  ├── resolveNumericProgress(stat)
  └── getVisibleStatValue(stat)
        ├── formatStatValue(stat)
        └── composeValueWithUnit(...)
  ▼
Semantic article + visible value/note/disclosure + optional CSS progressbar
```

No reverse data flow exists. There are no callbacks, state writes, subscriptions, context reads, or content imports.

## 4. Visual and responsive design

The feature extends the repository's clinical phase vocabulary rather than creating a generic SaaS card grid:

- section heading: `font-display`, strong `text-text-primary` hierarchy;
- telemetry labels and values: `font-mono`, uppercase/tracking for microcopy, and tabular numerals;
- cards: crisp `border-border-default`, `bg-surface-raised`, `shadow-subtle`, and repository radius tokens;
- progress track/fill: `bg-surface-sunken` and `bg-accent-primary` or `bg-accent-secondary`;
- supporting text: `font-ui text-text-secondary` or `text-text-muted`;
- format and parody badges: existing accent/status foreground/background/border tokens only.

No hex value, new token, gradient, or Tailwind configuration change is permitted. Color reinforces hierarchy but does not carry the parody meaning; the Spanish disclosure text always does.

The list contract is `grid grid-cols-1 gap-3 sm:grid-cols-2`. No three- or four-column breakpoint is added. `w-full`, `min-w-0`, `overflow-hidden`, and `break-words` are applied at the relevant container/card/value boundaries so long synthetic text cannot force horizontal overflow at 360–430px. The section may use an existing maximum-width utility but does not depend on the application `Section` component.

## 5. Planned files and review budget

Seven new files are planned, including the explicitly required dedicated card suite:

| File                                            | Responsibility                                                                      | Target lines |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- | -----------: |
| `src/features/vitales/VitalSigns.tsx`           | Props, named section, semantic list/grid, order-preserving map                      |        35–42 |
| `src/features/vitales/StatCard.tsx`             | Article hierarchy, visible metadata, optional note/humor, progress semantics        |        55–65 |
| `src/features/vitales/statPresentation.ts`      | Exhaustive map, locale/unit helpers, progress resolver                              |        50–60 |
| `src/features/vitales/index.ts`                 | Public exports                                                                      |          4–6 |
| `src/features/vitales/VitalSigns.test.tsx`      | Multi-stat container, ordering, mobile structure, and motion-independent visibility |        55–65 |
| `src/features/vitales/StatCard.test.tsx`        | Dedicated per-card format, optional-content, semantic, humor, and progress coverage |       85–100 |
| `src/features/vitales/statPresentation.test.ts` | Minimal pure-policy tests not already proved through `StatCard`                     |        20–28 |
| **Estimated total**                             | **Four production files and three test files**                                      |  **304–366** |

Implementation must stay at or below 400 changed source/test lines, with a practical target of 320–370 lines. `StatCard.test.tsx` should use compact table-driven cases where that preserves diagnostic clarity. `VitalSigns.test.tsx` must not repeat card-level assertions, and `statPresentation.test.ts` remains only for pure contracts that cannot be proved clearly at the rendered boundary. If the candidate reaches 380 lines, consolidate fixture builders and remove duplicated assertions before adding behavior. Crossing 400 requires scope re-approval under the configured ask-on-risk strategy; it is not solved by silently dropping required `StatCard` coverage or adding a PR slice.

No shared fixture module, hook, CSS file, story, content entry, or reduced-motion helper is planned.

## 6. Test design

### 6.1 Suite-local synthetic fixtures

Each component suite owns only the neutral synthetic data it needs:

- `VitalSigns.test.tsx` defines one local multi-stat collection parsed through `StatCollectionSchema`, containing `number`, `percentage`, `text`, and numeric `progress` entries in a deliberate order.
- `StatCard.test.tsx` defines compact local card cases parsed through `StatSchema`, including number with and without unit, percentage, text, numeric progress, above/below-range progress, nonnumeric progress, noted/noteless, humorous, and non-humorous variants.
- `statPresentation.test.ts` uses the smallest typed values needed to exercise pure policy boundaries.

Tests never import `src/content/stats.ts`, never add a shared fixture file, and never use biography-like values. Parsing remains explicit in the component suites so the synthetic contract is demonstrably schema-valid without consuming review budget on a fixture abstraction.

### 6.2 `VitalSigns.test.tsx`: container and collection behavior

This suite stays focused on behavior owned by the container:

1. Render one schema-validated collection and prove the named section, semantic list, and all supplied cards are present together.
2. Show all four formats in the same multi-stat rendering, asserting only enough visible output to prove the container did not omit a variant; detailed formatting remains in `StatCard.test.tsx`.
3. Prove input order from the sequence of card labels.
4. Deep-freeze the parsed array and each entry, preserve an equivalent pre-render copy, render, and prove the input remains deeply equal and rendering does not mutate frozen data.
5. Prove the mobile-first structural contract on the grid and overflow boundaries: `grid-cols-1`, `sm:grid-cols-2`, no higher-column class, and the planned `w-full`/`min-w-0`/`overflow-hidden`/`break-words` safeguards at their owning elements.
6. Render under normal and `prefers-reduced-motion: reduce` `matchMedia` responses and synchronously compare a compact user-visible readback for the full collection. Final values and supporting content must be present immediately in both modes without `waitFor`, timer advancement, effect flushing, or animation-owned placeholder state.

The order/non-mutation case and the reduced-motion case may reuse a small in-file fixture builder, but they must not duplicate card-level formatting, note, humor, clamping, fallback, or ARIA assertions.

### 6.3 `StatCard.test.tsx`: dedicated card contract

This suite owns the explicit per-card user contract:

1. Render numeric `number` both without a unit and with a unit, proving Spanish/Argentine localization and exact one-time composition such as `1.200 hs`.
2. Render `percentage` and `text` values exactly as supplied.
3. Render an in-range numeric `progress` value and prove visible text, CSS width, and progressbar semantics use the same value.
4. Render progress above 100 and below 0 and prove displayed text, width, and `aria-valuenow` clamp to 100 and 0 respectively.
5. Render schema-valid nonnumeric progress and prove the original text remains visible while no progressbar role, numeric ARIA attributes, or invented percentage is present.
6. Render a card with a note and one without it, proving supporting text is optional and no placeholder is emitted.
7. Render humorous and non-humorous peers, proving the centralized Spanish disclosure is visible only for the humorous card. The assertion queries the disclosure by text content, which is the direct evidence that meaning is not conveyed by color alone.
8. Prove the article is named by its label heading, numeric progress derives its accessible name from that label and exposes valid `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`, and the card contains no focusable control or positive `tabindex`.

Cases may be grouped or parameterized, but failures must still identify the affected format or edge condition. This suite does not retest list order, collection non-mutation, grid breakpoints, or reduced-motion collection behavior.

### 6.4 Minimal pure presentation-policy suite

`statPresentation.test.ts` is retained because exhaustive map shape and helper-only suffix handling are pure contracts that are clearer without DOM coupling. It covers only:

- exact `number`, `percentage`, `text`, and `progress` map keys;
- unchanged string formatting and the single `es-AR` numeric formatter contract;
- separator behavior and identical-unit suffix de-duplication in `composeValueWithUnit`.

It does not repeat card rendering, progress clamping, nonnumeric fallback, notes, humor disclosure, or semantic assertions. Those are owned by `StatCard.test.tsx`.

### 6.5 Reduced-motion and no-state proof

The `VitalSigns` normal/reduced-motion readback proves equivalent immediate user-visible output. Verification additionally scans production source for forbidden hooks and scheduling/browser APIs. Together they prove that motion preferences do not change content and that no timer, effect, listener, observer, or hidden animation state is waiting to reveal it.

Raw `innerHTML` is not compared because `useId()` values are implementation identities rather than user-visible behavior.

## 7. Isolation and verification

### 7.1 Static boundary checks

Before candidate freeze, inspect only the four production files with a targeted search for forbidden APIs:

```bash
rg -n "use(State|Effect|LayoutEffect)|requestAnimationFrame|setTimeout|setInterval|addEventListener|MutationObserver|IntersectionObserver|ResizeObserver|<svg|<canvas" \
  src/features/vitales/VitalSigns.tsx \
  src/features/vitales/StatCard.tsx \
  src/features/vitales/statPresentation.ts \
  src/features/vitales/index.ts
```

Expected result: no matches.

Run a second targeted import scan for `content`, `App`, layout/shell, navigation, section registry, active-section, experience-phase, chart, and animation dependencies. Expected result: no matches. Type imports from `src/domain` and feature-local imports are the only non-React dependencies.

### 7.2 Protected-path proof

The implementation candidate's changed-path list must match this allowlist only:

```text
src/features/vitales/VitalSigns.tsx
src/features/vitales/StatCard.tsx
src/features/vitales/statPresentation.ts
src/features/vitales/index.ts
src/features/vitales/VitalSigns.test.tsx
src/features/vitales/StatCard.test.tsx
src/features/vitales/statPresentation.test.ts
```

Verification compares the content-bound candidate diff against its implementation base, not an unrelated dirty worktree. Any changed path outside `src/features/vitales/**` fails Phase A. In particular, the candidate diff must be empty for all protected paths, `src/content/stats.ts`, `src/domain/**`, manifests, tokens, and Tailwind configuration. This also proves Issues #6/#11 work was not incorporated into this change.

### 7.3 Quality gates

Run the repository gates after implementation:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The build confirms the existing Tailwind configuration recognizes all static utility classes. Unit tests prove the one-column/two-column class contract; because jsdom does not perform layout, it must not be cited as pixel-overflow proof. The structural overflow safeguards (`w-full`, `min-w-0`, `overflow-hidden`, `break-words`) and the generated responsive CSS are the Phase A evidence. Full in-application viewport screenshots remain part of the separately authorized integration phase.

## 8. Risks and mitigations

- **Locale behavior differs by runtime:** one module-level formatter and one focused exact-output test expose an ICU mismatch immediately.
- **Unit duplicated in authored strings:** centralized suffix-aware composition avoids duplicate `%` or repeated units while leaving the supplied string unchanged.
- **String progress mistaken for a measurement:** no coercion and no progressbar role prevent fabricated clinical semantics.
- **Parody styling appears factual:** every humorous card includes explicit visible Spanish disclosure text, independent of token color.
- **Long content causes mobile overflow:** grid children use `min-w-0`; values use wrapping and remain inside an overflow-safe card.
- **Review budget pressure:** use three deliberately partitioned suites, compact schema-validated local fixtures, and no helper/hook/shared-fixture/CSS test files; remove cross-suite duplication before approaching 400 changed source/test lines.
- **Concurrent work contamination:** enforce the seven-file candidate allowlist and reject any protected-path delta.

## 9. Rollout and rollback

Phase A rollout consists only of adding and validating the isolated module. There is no application import, route, registry entry, content connection, navigation change, or user-visible production behavior. The barrel export makes the module integration-ready for a later authorized change but does not activate it.

Rollback is deletion of the seven new `src/features/vitales/**` files. No migration, content restoration, dependency removal, schema rollback, token rollback, or protected-path repair is required.
