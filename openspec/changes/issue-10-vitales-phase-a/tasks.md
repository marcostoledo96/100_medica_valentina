# Tasks — Issue #10 Vital Signs, Phase A

Change: `issue-10-vitales-phase-a`
Artifact store: OpenSpec
Mode: Strict TDD (`npm test` = `vitest run`), delivery_strategy=ask-on-risk, review budget 400 changed lines.

Phase A creates the isolated `src/features/vitales/**` module only. It does NOT create a PR, does NOT integrate into `App`/`NarrativeShell`/section registries, and does NOT close Issue #10. All changes are confined to the seven new files under `src/features/vitales/**`; protected paths, `src/content/stats.ts`, `src/domain/**`, manifests, tokens, and Tailwind config stay untouched.

## Review Workload Forecast

| Field                   | Value                                         |
| ----------------------- | --------------------------------------------- |
| Estimated changed lines | 310–370 (design target 320–370; hard cap 400) |
| 400-line budget risk    | Low                                           |
| Chained PRs recommended | No                                            |
| Suggested split         | single PR (Phase A creates none)              |
| Delivery strategy       | ask-on-risk                                   |
| Chain strategy          | pending                                       |

```text
Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low
```

Forecast basis: seven new files (four production, three test) per design §5, no schema/content/dependency changes, no integration points. If the candidate reaches 380 lines, consolidate fixture builders and remove duplicated assertions before adding behavior; crossing 400 requires scope re-approval under ask-on-risk — it is not solved by dropping required `StatCard` coverage or adding a PR slice.

---

## 0. Baseline

- [x] Confirm the untouched tree is green before any new file: run `npm run typecheck` and `npm test` and record both as passing, so later RED failures are provably caused by the new tests. <!-- sdd-owner: implementation -->

## 1. Pure presentation policy — `src/features/vitales/statPresentation.ts`

- [x] RED: write `src/features/vitales/statPresentation.test.ts` with failing core cases: exhaustive map keys `number`/`percentage`/`text`/`progress`; `formatStatValue` returns string values unchanged and formats numeric `1200` as `1.200` (es-AR); `composeValueWithUnit` composes `1.200` + `hs` → `1.200 hs` exactly once; `resolveNumericProgress` returns `{ value: 100, width: '100%' }` for in-range numeric progress. Run `npm test -- src/features/vitales/statPresentation.test.ts` and record the failure (module not found). <!-- sdd-owner: implementation -->
- [x] GREEN: implement `src/features/vitales/statPresentation.ts` — `statPresentation` map (`defaultHeading`, `humorDisclosure: 'Dato en modo parodia'`, `formats`) typed `as const satisfies { ...; formats: Record<StatFormat, StatFormatPresentation> }`; one module-level `Intl.NumberFormat('es-AR')`; pure helpers `formatStatValue`, `composeValueWithUnit`, `resolveNumericProgress`, `getVisibleStatValue`. No React/DOM/browser-global imports. Run the suite until green. <!-- sdd-owner: implementation -->
- [x] TRIANGULATE: extend `src/features/vitales/statPresentation.test.ts` with edge cases: numeric percentage value with unit; progress `250` clamps to `100` and `-5` clamps to `0` (value and width); nonnumeric progress returns `null`; identical-unit suffix de-duplication (`99.9%` + unit `%` stays `99.9%`, no `% %`); string values never reformatted. Run the suite green. <!-- sdd-owner: implementation -->
- [x] REFACTOR: keep the module pure and exhaustive — no DOM, side-effect, or component dependency; confirm `npm run typecheck` passes and the map still satisfies `Record<StatFormat, ...>` (all four keys enforced by the type system). <!-- sdd-owner: implementation -->

## 2. Card primitive — `src/features/vitales/StatCard.tsx`

- [x] RED: write `src/features/vitales/StatCard.test.tsx` with failing core cases (fixtures parsed through `StatSchema` from `src/domain/schemas/stats.schema.ts`): numeric `number` without unit → `1.200`; with unit `hs` → `1.200 hs`; `percentage` string `99.9%` and `text` string rendered exactly as supplied; in-range numeric `progress` (100, unit `%`) shows composed value, CSS width, and `aria-valuenow` all at `100` with `aria-valuemin="0"`/`aria-valuemax="100"`; article named by label via `aria-labelledby`; no focusable control and no positive `tabindex`. Run `npm test -- src/features/vitales/StatCard.test.tsx` and record the failure. <!-- sdd-owner: implementation -->
- [x] GREEN: implement `src/features/vitales/StatCard.tsx` — non-interactive `article` with `h3` label (collision-safe `useId()`), visible format metadata, value via `getVisibleStatValue`, optional note, humor disclosure only when `humorous: true` (visible Spanish text, never color alone), and for numeric progress a plain CSS bar with `role="progressbar"`, `aria-labelledby` → label, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-valuenow={progress.value}`, and `style={{ width: progress.width }}`. All presentation decisions delegated to `statPresentation.ts`. Run the suite until green. <!-- sdd-owner: implementation -->
- [x] TRIANGULATE: extend `src/features/vitales/StatCard.test.tsx` with edge cases: progress `250` → text/width/`aria-valuenow` clamp to `100`; progress `-5` → clamp to `0`; schema-valid nonnumeric progress → original text visible, NO `role="progressbar"` and NO `aria-value*` attributes, no invented percentage; note present vs absent (no placeholder); humorous vs non-humorous peers — disclosure found by text content only on the humorous card. Run the suite green. <!-- sdd-owner: implementation -->
- [x] REFACTOR: confirm `StatCard` contains no `useState`/`useEffect`/`useLayoutEffect`, no listeners/observers/timers/rAF, no `<svg>`/`<canvas>`, and no duplicated formatting/unit/humor logic; `npm run typecheck` passes. <!-- sdd-owner: implementation -->

## 3. Container — `src/features/vitales/VitalSigns.tsx`

- [x] RED: write `src/features/vitales/VitalSigns.test.tsx` with failing core cases (one local multi-stat collection parsed through `StatCollectionSchema`, all four formats, deliberate order): named `section` whose accessible name is the heading (via `aria-labelledby`); semantic `ul` grid with `grid grid-cols-1 gap-3 sm:grid-cols-2` and no higher-column class; all four formats present in one render; card order matches input order. Run `npm test -- src/features/vitales/VitalSigns.test.tsx` and record the failure. <!-- sdd-owner: implementation -->
- [x] GREEN: implement `src/features/vitales/VitalSigns.tsx` — `VitalSignsProps { stats: readonly Stat[]; heading?: string; className?: string }`, `section` + `h2` (collision-safe `useId()`), `ul` grid, `stats.map(...)` in caller order with no copy/sort/filter/mutation, `li` → `StatCard`. No import of `src/content/**`, shell, registry, navigation, or phase state. Run the suite until green. <!-- sdd-owner: implementation -->
- [x] TRIANGULATE: extend `src/features/vitales/VitalSigns.test.tsx`: deep-freeze the parsed array and entries, keep a pre-render copy, render, and prove the input is deeply equal afterward (no mutation); prove overflow safeguards (`w-full`, `min-w-0`, `overflow-hidden`, `break-words`) at their owning elements; render under `window.matchMedia` mocked to `(prefers-reduced-motion: reduce)` and compare a synchronous user-visible readback (e.g., section text content) with normal mode — identical, with no `waitFor`, timer advancement, or effect flushing. Run the suite green. <!-- sdd-owner: implementation -->
- [x] REFACTOR: confirm `VitalSigns` has no state/effect/listener/observer/timer/rAF, no content or shell imports, and delegates all presentation to `statPresentation.ts`; `npm run typecheck` passes. <!-- sdd-owner: implementation -->

## 4. Public barrel — `src/features/vitales/index.ts`

- [x] Create `src/features/vitales/index.ts` re-exporting the public surface (`VitalSigns`, `StatCard`, and the presentation helpers). Verify with `npm run typecheck` and `npm run build` that every export resolves to a real symbol, and confirm the three suites still pass with `npm test`. <!-- sdd-owner: implementation -->

## 5. Source scans (static boundary checks)

- [x] Run the forbidden-API scan on the four production files and record zero matches:
      `rg -n "use(State|Effect|LayoutEffect)|requestAnimationFrame|setTimeout|setInterval|addEventListener|MutationObserver|IntersectionObserver|ResizeObserver|<svg|<canvas" src/features/vitales/VitalSigns.tsx src/features/vitales/StatCard.tsx src/features/vitales/statPresentation.ts src/features/vitales/index.ts` <!-- sdd-owner: implementation -->
- [x] Run the import scan on the four production files and record zero matches for `content`, `App`, layout/shell, navigation, section registry, active-section, experience-phase, chart, and animation dependencies; only `react`, `src/domain` type imports, and feature-local imports are allowed. <!-- sdd-owner: implementation -->

## 6. Quality gates

- [x] Run `npm run format:check` and fix any formatting drift with `npm run format` (re-run `format:check` until clean) before the remaining gates. <!-- sdd-owner: implementation -->
- [x] Run `npm run lint` (0 errors, `--max-warnings=0`), `npm run typecheck` (0 errors), `npm test` (all suites green), and `npm run build` (static build success) and record each receipt. <!-- sdd-owner: implementation -->

## 7. Protected-path diff validation

- [x] Validate the candidate diff against the implementation base: `git status --porcelain` and `git diff --name-only` (plus untracked) must list exactly the seven allowlisted files — `src/features/vitales/VitalSigns.tsx`, `StatCard.tsx`, `statPresentation.ts`, `index.ts`, `VitalSigns.test.tsx`, `StatCard.test.tsx`, `statPresentation.test.ts`. Any path outside `src/features/vitales/**` fails Phase A; the diff must be empty for all protected paths, `src/content/stats.ts`, `src/domain/**`, manifests, tokens, and Tailwind config (proves Issues #6/#11 work was not incorporated). <!-- sdd-owner: implementation -->

## 8. Conventional commits (conditional)

- [x] If and only if `git status --porcelain` shows only the seven new vitales files with no unrelated staged/unstaged changes, create two small conventional commits with zero AI attribution: `feat(vitales): add isolated vital signs presentation module` (the four production files) followed by `test(vitales): add focused suites for vital signs module` (the three test files). If the repository state does not permit coherent commits (unrelated dirty state, mid-merge, detached base), skip both commits and report the reason instead. <!-- sdd-owner: implementation -->

---

## Parent actions (post-apply)

- [ ] Start or reuse bounded review of the frozen candidate (seven-file allowlist, gates receipts, scan results) after apply completes. <!-- sdd-owner: parent -->
- [ ] Confirm the ask-on-risk decision gate: forecast is under 400 lines and no chaining is recommended, so no scope re-approval is required before apply; if the candidate crosses 400 changed lines, stop and request re-approval. <!-- sdd-owner: parent -->
