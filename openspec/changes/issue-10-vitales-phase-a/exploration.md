# Exploration — Issue #10 Phase A: Signos Vitales stats section

Change: `issue-10-vitales-phase-a`
Status: exploration (no source changes made)
Scope: `src/features/vitales/**` (new), optional `src/content/stats.ts` content addition, optional shared `src/lib`/`src/hooks` helpers. All other paths read-only.

## 1. Authority sources read (complete)

- `AGENTS.md` — stack (React 18, TS strict, Tailwind tokens, Zod, Vitest+Testing Library, no DB), golden rule (content 100% decoupled, no hardcoded names/dates/narrative in JSX), quality gates (`npm run lint` 0 warnings, `typecheck`, `npm test`, `npm run build`), conventional commits without AI attribution, clinical-phase aesthetic (monospace data, dark neutral surfaces, monitor green/cyan accents, status pills), warm parody humor limits.
- Issue #10 body (provided by orchestrator) — lightweight credible clinical-parody stats section; consume existing Stat schema/content; typed number/percentage/progress/text variants; optional count-up with final-value fallback; mobile grid; tests for formats and reduced motion; no heavy charts; humor clearly signaled; data from `src/content`; quality gates.
- `.agents/skills/gentle-sdd-react/SKILL.md` — schema → content → presentational primitive → container → tests lifecycle; props decoupled from content sources; mobile 360–430px + ARIA in verification.
- `.agents/skills/frontend-design/SKILL.md` — clinical phase = high-density monospace telemetry, crisp border grids, muted surgical slate/carbon, monitor greens `#10b981`/`#06b6d4`, clinical badges; reduced motion ⇒ count-up renders final value immediately; UI durations 150–300ms, reveals 400–700ms.
- `.agents/skills/mobile-ux-storytelling/SKILL.md` — one narrative beat per section; no mandatory drag; guided vertical composition.
- `docs/04_DISENO_MOBILE_FIRST.md` — base 390px, validate 360/390/412/430; one column mobile, lateral padding 16–20px; count-up explicitly allowed (§14); reduced motion ⇒ replace count-up with final value (§15); color meaning not red/green only; touch targets 44×44px; no scroll hijacking.
- `docs/07_ISSUES_Y_CRITERIOS.md` — #10 is P1, deps #2/#3/#4 satisfied (design tokens, schemas, shell exist). Refinement policy: read issue, confirm deps, confirm schemas, decoupled props, fixtures if content missing, verifiable mobile/a11y/test criteria, no hardcoded biography in JSX, quality-gate receipts. Global DoD: 360–430px responsive, WCAG 2.2 AA, reduced motion, decoupled content, zero invented data presented as facts, tests proportional to risk, gates green.
- `docs/08_CALIDAD_ACCESIBILIDAD_PERFORMANCE.md` — unit-test priorities include formatting, reduced-motion helpers, optional-content fallbacks; component tests for components with states; semantic `section`/headings/real buttons; no positive `tabindex`; reduced motion via `prefers-reduced-motion`; final content must exist without transitions; JS payload kept low; failures degrade (interrupted animation ⇒ action still available).
- `docs/03_ESPECIFICACION_FUNCIONAL.md` RF-004 — humorous metrics; types number/percentage/text/progress; deliberately absurd figures must be clearly signaled as such (maps to `humorous` flag + presentation). RNF-008: all visible copy in Spanish. RNF-004: every protagonist animation has an alternative.
- `docs/05_MODELO_DE_DATOS_Y_CONTENIDO.md` — Stat model documented; content lifecycle fixture→preview→feedback→corroboration; 4–8 stats target for full version; no invented biography in fixtures.
- `src/domain/schemas/stats.schema.ts` — `StatFormatSchema = z.enum(['number','percentage','text','progress'])`; `StatSchema` = `{ id, label, value: number | NonEmptyString, unit?, format, note?, humorous? }`; `StatCollectionSchema` min 1, unique ids. **Schema already supports all four formats; no schema change needed.**
- `src/domain/schemas/stats.schema.test.ts` — schema-level tests exist (numeric/string values, invalid format, empty value, whitespace labels, empty collection, duplicate ids). No changes required.
- `src/content/stats.ts` — 3 demo fixtures: `number` (1200 hs), `percentage` ('99.9%'), `progress` (100, unit '%'). **Gap: no `text`-format fixture exists** (see §7).
- `src/styles/tokens.css` + `tailwind.config.js` — full token→utility mapping: `bg-surface-*`, `text-text-*`, `border-border-*`, `accent-primary/secondary/muted`, `status-*`, `shadow-subtle/raised/glow`, `rounded-sm/md/lg`, `font-ui/mono/display`, `duration-fast/normal/slow`, `ease-clinical/standard/spring`, `min-h-touch`/`min-w-touch` (44px). Reduced-motion override zeroes all durations globally via CSS. No custom spacing/width utilities needed.
- Protected paths honored: `src/App.*`, `src/content/sections.*`, `src/components/layout/**`, `src/hooks/useActiveSection*`, `src/features/expediente/**`, `src/features/gallery/**` were NOT inspected or modified. No NarrativeShell integration; Issues #6/#11 untouched. `package.json` confirms **no animation library is installed** (react, react-dom, zod only) — count-up must be dependency-free.

## 2. Contract constraints (derived)

1. Data contract: consume `Stat` from `src/domain/types` (`export type { StatFormat, Stat, StatCollection }`), validated content from `src/content/stats.ts` (`statsContent`). Components must not import content; props typed from domain schema (Timeline precedent).
2. Variant coverage: `number`, `percentage`, `text`, `progress` all typed and rendered; unknown formats impossible (zod enum).
3. No heavy charts: progress bar is a plain div/CSS width, not an SVG chart library.
4. Humor signaling: `humorous: true` must be visibly signaled (badge/pill or mono tag), labels Spanish, parody tone per AGENTS.md §2.3 (no real-health jokes).
5. Optional count-up with final-value fallback: reduced motion ⇒ final value immediately; non-numeric values never animate.
6. Mobile grid: 1 column at 360px (no horizontal overflow), up to 2 at ≥640px; desktop capped by `Section` container (max-w-2xl/4xl per docs/04 900–1100px).
7. Accessibility: semantic `section`/`article` + heading hierarchy; progress bar as `role="progressbar"` with `aria-valuenow/min/max` and accessible name; cards `aria-labelledby` the stat label; no positive tabindex; focus ring pattern only if interactive elements are introduced.
8. Quality gates: lint/typecheck/test/build green; formatting helpers and reduced-motion helpers unit-tested (docs/08 §3); content stays visible without scripted reveal state (Timeline test precedent).

## 3. Reusable patterns (non-protected reference implementations)

| Pattern                    | Reference                                                                                                                                                                                                            | How to reuse                                                                                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feature module layout      | `src/features/timeline/` (`Timeline.tsx`, `TimelineEntryCard.tsx`, `timelinePresentation.ts`, `index.ts`, tests)                                                                                                     | New `src/features/vitales/` mirrors it: container + card + presentation module + barrel                                                                    |
| Presentation mapping       | `timelinePresentation.ts` — `as const satisfies` record keyed by domain enum, mapping to `{ label, badgeClassName }`; pure `formatX` helpers                                                                         | `statPresentation.ts` maps `StatFormat` → value/bar/badge classes + `formatStatValue()` pure helper                                                        |
| Decoupled props            | `TimelineProps { entries: readonly TimelineEntry[]; heading?; className? }`                                                                                                                                          | `VitalsDashboardProps { stats: readonly Stat[]; heading?; className? }`; heading default is UI microcopy (Spanish), same as Timeline's `'Línea de tiempo'` |
| Semantic card              | `TimelineEntryCard` — `article` + `aria-labelledby` title id (`timeline-entry-${id}-title`)                                                                                                                          | `StatCard` uses `aria-labelledby` with `stat-${id}-label`; `Card` primitive optional (feature-local card matches Timeline precedent)                       |
| Token usage                | Tailwind token utilities (`bg-surface-raised`, `border-border-default`, `font-mono`, `text-text-muted`, `rounded-lg`, `shadow-raised`, `duration-normal`, `ease-clinical`)                                           | Same vocabulary; values in `font-mono` + `tabular-nums`-style mono, badges `rounded-full border px-2 py-1`                                                 |
| Test fixtures              | `Timeline.test.tsx` builds fixtures via `TimelineCollectionSchema.parse(...)`; asserts role/list/article, heading levels, class contracts via `toHaveClass(...contract.split(' '))`, "no scripted reveal" visibility | Same approach; per-format fixtures parsed through `StatCollectionSchema`; class-contract tests for format badges; `toBeVisible()` without animations       |
| Reduced motion             | CSS token override in `tokens.css` zeroes durations; `BootScene.css` `@media (prefers-reduced-motion: reduce)` animation none                                                                                        | CSS handles transitions; count-up needs a JS `matchMedia` check (new helper, see §6)                                                                       |
| Content central validation | `src/content/index.ts` + `content/index.test.ts` (already asserts `statsContent.length > 0`)                                                                                                                         | Adding a 4th stat keeps these green; no change needed                                                                                                      |
| Phase awareness            | `useExperiencePhase()`/`ExperiencePhaseProvider` exist but **not required**: stats use pure CSS tokens, which auto-switch per `[data-experience-phase]`                                                              | Do not read phase context in Phase A                                                                                                                       |

## 4. Central presentation mapping (options)

`statPresentation.ts` options for `format` → rendering:

- **Option A (recommended): declarative map + pure formatter.** `statPresentation.formats: Record<StatFormat, { valueClassName, badgeClassName?, progressClassName? }>` plus `formatStatValue(stat): string` and `resolveProgress(stat): { value: number, max: 100 } | null`. Matches `timelinePresentation` exactly; unit-testable without DOM; `satisfies` keeps exhaustiveness.
  - `number`: `formatStatValue` → `Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })` + `unit` suffix (e.g. `1.200 hs`). Fallback: manual thousands separator if Intl unavailable (not required in modern Node/jsdom).
  - `percentage`: string value rendered as-is (fixture `'99.9%'`); numeric value + `unit` (e.g. `'%'`) composed; no animation.
  - `text`: value string rendered as-is, larger display treatment; no animation.
  - `progress`: numeric value clamped 0–100; width `%` via inline style or Tailwind arbitrary value; `role="progressbar"` `aria-valuenow={clamped}`; text `value + unit` visible; string values degrade to text rendering (schema permits them) — decide in design whether to clamp-parse or render as text.
- **Option B: switch statement inside component.** More code in JSX, harder to test; not recommended.
- **Humor badge**: `humorous: true` ⇒ mono pill (e.g. `border-border-accent bg-accent-muted text-accent-primary` with a Spanish tag like `MODO PARODIA`/`CÓMICO`) driven by a `humorLabel` entry in the presentation map; note text (`note`) rendered muted. Label strings live in presentation module, not JSX literals (AGENTS.md golden rule spirit + RNF-008).

## 5. Accessibility & mobile requirements (consolidated)

- Semantics: outer `section` with `h2` (aria-labelledby pattern per timeline); each stat an `article` with `aria-labelledby` label id; progress: `role="progressbar"` + `aria-valuenow/valuemin(0)/valuemax(100)` + name via label id; decorative bar inner div `aria-hidden="true"`.
- Content visible without transitions: value text is present in initial DOM (final value); count-up only mutates text via rAF when allowed. Satisfies docs/08 §7 and Timeline test precedent.
- Reduced motion: JS helper `prefersReducedMotion()` (matchMedia listener, SSR-safe) → count-up skipped, final value rendered; CSS transitions collapse via token override.
- Touch: no interactive elements required in Phase A (cards are non-interactive) — if a control is added, `min-h-touch`/`min-w-touch` (44px) + `focus-visible:ring-2 ring-focus ring-offset-surface-base` per Button.
- Mobile grid: `grid grid-cols-1 gap-3 sm:grid-cols-2` (sm breakpoint; tablet 2 cols, desktop capped by Section `containerWidth="md"` or `"lg"`); 360px overflow test.
- Color: value emphasis via accent + mono, never red/green-only meaning (docs/04 §9).

## 6. Count-up decision (minimal recommendation)

**Recommendation: INCLUDE, narrowly scoped, dependency-free.** Rationale: allowed by docs/04 §14, expected by frontend-design skill, and the fallback path is already mandated. Implementation shape (for design phase):

- `useCountUp(target: number, opts?: { enabled?: boolean; duration?: number })` hook in `src/features/vitales/` (rAF, ~700ms, ease-out cubic, respecting `--motion-ease-clinical` spirit; durations 400–700ms per frontend-design).
- Final-value fallback (render final immediately) when: `prefers-reduced-motion` matches, `target` not finite, or `enabled` false. Initial DOM always contains the final formatted value.
- Only `format === 'number'` animates; percentage/text never animate; progress animates via CSS width transition (`transition-[width] duration-slow ease-clinical` → auto-zeroed under reduced motion).
- Tests: fake timers advance → intermediate then final; `matchMedia` mock with `prefers-reduced-motion: reduce` → final value immediately, no animation frame scheduled.
- **Compliant alternative: OMIT.** Issue marks count-up optional; omitting keeps Phase A strictly smaller and zero animation risk. If the PO prefers omission, no schema/content/component changes follow — only the hook and its tests disappear.

## 7. Content gap (decision for proposal)

`src/content/stats.ts` has no `text`-format fixture, so the `text` variant would be typed but never exercised by real content. Options:

- **A (recommended): add one demo `text` stat** (`format: 'text'`, `humorous: true`, demo note mirroring existing fixtures, e.g. `value: 'Intermitente'`-style parody with explicit "Dato cómico demostrativo" note). `src/content/stats.ts` is NOT protected; `content/index.test.ts` only asserts `length > 0`, stays green. Keeps demo-fixture parity and exercises the variant end-to-end; parody signaling enforced by `humorous` badge.
- B: leave content untouched; component tests cover `text` via local fixtures only (variant still implemented and tested, just not in shipped fixtures).

No schema change is needed for either option.

## 8. Candidate Phase A file layout (for proposal/design/tasks)

New files (all outside protected paths):

- `src/features/vitales/VitalsDashboard.tsx` — container: `section` + `h2` + grid, props `{ stats, heading?, className? }`.
- `src/features/vitales/StatCard.tsx` — presentational card per format + humor badge + note.
- `src/features/vitales/statPresentation.ts` — format map + `formatStatValue` + `resolveProgress` + humor label.
- `src/features/vitales/useCountUp.ts` — dependency-free rAF count-up with reduced-motion/final-value fallback.
- `src/lib/prefersReducedMotion.ts` — SSR-safe matchMedia helper (docs/08 §3 wants reduced-motion helpers unit-tested; lib is non-protected).
- Tests: `VitalsDashboard.test.tsx`, `StatCard.test.tsx`, `statPresentation.test.ts`, `useCountUp.test.tsx`, `prefersReducedMotion.test.ts` (matchMedia mock), optionally extending stats schema/content test only if §7-A is chosen.
- `src/features/vitales/index.ts` barrel (feature convention).

No changes to: `package.json` (no new dependency), tokens, tailwind config, `src/domain/**`, `src/content/index.ts`, `src/content/sections.*`, any protected path.

## 9. Risks & mitigations

- **No animation library**: hand-rolled rAF hook. Mitigation: ~30-line hook, fake-timer tests, reduced-motion + non-finite guards; no dependency added (keeps JS payload low per docs/08 §8).
- **Locale-dependent formatting in tests**: `Intl.NumberFormat('es-AR')` — modern Node ships full ICU; keep formatter pure and assert exact `1.200` output; fall back to manual separator if needed.
- **Progress string values** (schema allows `value: string` for any format): define explicit degradation in design (clamp-parse or text render) to avoid undefined behavior.
- **Content fixture invention**: any new fixture must be clearly demo/humorous (`humorous: true` + demo note) per RF-004/§7-A; no real facts invented.
- **Concurrency**: #6/#11 + protected paths untouched; no `sections.ts` import; no shell wiring (Phase A ships the feature module only; integration is a later phase).
- **Budget**: ~8 new small files, far below the 400-line review budget; single PR slice per delivery strategy.

## 10. Decisions deferred to proposal/design

1. §7 content option A vs B (add `text` demo stat or not).
2. §6 count-up include (recommended) vs omit.
3. Grid breakpoints (`sm:grid-cols-2` vs `md`) and `Section` container width (`md` vs `lg`).
4. Progress string-value degradation rule.
5. Humor badge copy and placement (badge vs inline mono tag) — copy must be Spanish.
