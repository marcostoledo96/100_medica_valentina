# Proposal — Issue #10 Vital Signs, Phase A

Change: `issue-10-vitales-phase-a`
Issue: [#10 — Implementar dashboard de signos vitales](https://github.com/marcostoledo96/100_medica_valentina/issues/10)
Status: proposed
Artifact store: OpenSpec

## Intent

Build the isolated, reusable presentation module for Issue #10's clinical-parody vital-sign statistics. Phase A should prove the domain variants, formatting rules, responsive card grid, accessibility semantics, humor signaling, and deterministic rendering before the feature is connected to the narrative application.

The immediate product outcome is a credible mobile-first `VitalSigns` section that can render typed `Stat` data supplied by a future integration owner. This phase intentionally does not make the section visible in the application and does not complete or close Issue #10.

## Problem and current-state gap

The repository already defines and validates the `Stat` contract, including `number`, `percentage`, `text`, and `progress`, but it has no feature module that presents those values as the clinical dashboard required by RF-004 and Issue #10. The absence of that module leaves formatting, progress semantics, humor disclosure, responsive behavior, and fallback behavior undefined at the UI boundary.

Phase A closes that technical presentation gap without competing with concurrent shell, expediente, or gallery work.

## Source-of-truth constraints

This proposal follows:

- `AGENTS.md` for the clinical visual language, mobile-first behavior, decoupled content, TypeScript strictness, and quality gates.
- The operational Issue #10 context captured in `exploration.md`: lightweight clinical-parody stats, all four formats, mobile grid, reduced-motion-safe final values, no heavy charts, visible humor signaling, and content-layer compatibility.
- `docs/03_ESPECIFICACION_FUNCIONAL.md` RF-004: humorous metrics must support number, percentage, text, and progress, and invented figures must not appear factual.
- `docs/07_ISSUES_Y_CRITERIOS.md`: Issue #10 is P1, its technical dependencies are satisfied, and fixture-backed implementation is allowed while real content is collected.
- The existing `Stat` schema and exported domain type; the schema already supports the acceptance criteria and must remain unchanged unless later evidence proves otherwise.

## Decisions

### Omit count-up animation

Phase A will not implement count-up behavior, animation hooks, request-animation-frame state, or an animation dependency. Issue #10 explicitly makes count-up optional. Rendering final values immediately is the smaller and safer architecture because it:

- keeps every value present in the initial render;
- behaves identically when reduced motion is requested;
- avoids intermediate or hidden animation state;
- makes tests deterministic; and
- reduces implementation and review workload.

Reduced-motion coverage will verify that all final content remains visible and unchanged when `prefers-reduced-motion: reduce` is active. There is no animated state to bypass or recover.

### Keep content and schema unchanged

Phase A will not add real, demo, or biography-like entries to `src/content/stats.ts`. Tests will define local synthetic fixtures, validated against the existing schema, that cover all four formats. Components will receive typed stats through props and will not import a content module directly.

No schema change is proposed. The existing `Stat` shape is sufficient. For a `progress` item with a numeric value, presentation logic will clamp the visual and ARIA value to the supported 0–100 range. If a schema-valid nonnumeric string is supplied for `progress`, the value must remain visible as text without fabricating numeric progress semantics.

### Stable component and presentation names

The public feature container will be named `VitalSigns`, and the card primitive will be named `StatCard`. Format labels, value composition, numeric localization, unit composition, progress resolution, visual format metadata, and humor-disclosure copy will be centralized in a feature-local presentation module rather than distributed across JSX branches.

## In scope

1. Add an isolated `src/features/vitales/**` feature module.
2. Implement `VitalSigns` as a semantic section with a heading and a mobile-first card grid.
3. Implement `StatCard` as a non-interactive, accessible article for one typed `Stat`.
4. Render and test all four formats: `number`, `percentage`, `text`, and `progress`.
5. Centralize presentation and formatting behavior in a pure, exhaustively typed module keyed by `StatFormat`.
6. Format numeric values consistently for the Spanish/Argentine presentation context and compose optional units without duplicating punctuation or spacing logic in components.
7. Represent numeric progress with a lightweight CSS bar and accessible `progressbar` semantics; no chart package or SVG chart system.
8. Visibly distinguish `humorous: true` values with centralized Spanish disclosure copy so parody cannot be mistaken for a real medical fact.
9. Render optional notes as supporting text and preserve final values in the initial DOM.
10. Use existing design tokens for clinical dark surfaces, crisp borders, monospace/tabular data treatment, and restrained monitor-green/cyan accents.
11. Add focused Vitest and Testing Library coverage using synthetic local fixtures for all variants, formatting and unit behavior, progress clamping/fallbacks, semantic labeling, humor signaling, mobile-grid class contracts, and reduced-motion final-value visibility.
12. Run the repository quality gates: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

## Out of scope and non-goals

- No integration with `App`, `NarrativeShell`, section registries, navigation, active-section state, or experience-phase orchestration.
- No import of `statsContent` into the feature and no change to real or demo content.
- No count-up, reveal animation, transition-owned visibility, Framer Motion usage, or new dependency.
- No schema redesign, migration, or change to domain exports unless a later phase demonstrates a concrete acceptance blocker.
- No heavy charts, canvas, SVG chart library, interaction controls, persistence, telemetry, or server work.
- No PR creation, issue closure, release action, or application-level screenshot claim in Phase A.
- No work on Issues #6 or #11; their concurrent changes remain untouched.

## Affected areas

Expected implementation is limited to new files under:

- `src/features/vitales/VitalSigns.tsx`
- `src/features/vitales/StatCard.tsx`
- `src/features/vitales/statPresentation.ts`
- `src/features/vitales/index.ts`
- focused tests under `src/features/vitales/**`

The exact test-file split may be refined during design/tasks, but production formatting must remain centralized and test fixtures must remain local and synthetic.

### Protected and read-only paths

The following paths must not be modified by this change:

- `src/App.tsx`
- `src/App.test.tsx`
- `src/content/sections.ts`
- `src/content/sections.test.ts`
- `src/components/layout/**`
- `src/hooks/useActiveSection*`
- `src/features/expediente/**`
- `src/features/gallery/**`

Additionally, Phase A intends no changes to `src/content/stats.ts`, `src/domain/**`, package manifests, design tokens, or Tailwind configuration.

## Acceptance and success criteria

Phase A succeeds when all of the following are true:

1. `VitalSigns` accepts `readonly Stat[]` through props and does not depend directly on application content or shell state.
2. Synthetic schema-validated fixtures demonstrate visible final output for `number`, `percentage`, `text`, and `progress`.
3. Formatting and format-specific presentation are centralized, exhaustive for `StatFormat`, and unit tested.
4. Numeric values and optional units render consistently; text values remain unchanged; numeric progress is bounded to 0–100; nonnumeric progress remains readable without false numeric ARIA attributes.
5. The section and cards expose semantic headings and labels, while numeric progress exposes an accessible name and valid `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
6. Humorous stats have an explicit visible Spanish parody indicator and are not communicated by color alone.
7. The layout is one column at compact mobile widths and can expand to two columns without horizontal overflow in the 360–430px target range.
8. All values and supporting content are present without waiting for effects, timers, observers, or animation state; reduced-motion mode shows the same final content.
9. Existing schemas, real/demo content, protected paths, and concurrent Issue #6/#11 areas remain unchanged.
10. Lint, typecheck, unit tests, and production build pass with no new dependency.

## Risks and mitigations

- **Locale-sensitive numeric output:** `Intl.NumberFormat` behavior can make brittle assertions. Mitigation: isolate one formatter, specify the intended locale, and test its contract in one place.
- **Ambiguous schema-valid progress strings:** the schema permits strings for every format. Mitigation: render such values visibly as text and omit fabricated progressbar semantics rather than coercing unknown content.
- **Parody mistaken for factual health data:** visual clinical styling can make jokes look authoritative. Mitigation: require a visible text disclosure for every `humorous: true` stat and avoid color-only signaling.
- **Generic card-grid appearance:** a mechanically correct grid could violate the project's visual direction. Mitigation: use the existing clinical token vocabulary, deliberate data hierarchy, crisp telemetry treatment, and no generic gradient/SaaS styling.
- **Phase A mistaken for completed product integration:** the module will not appear in the application yet. Mitigation: keep integration, PR, and issue closure explicitly outside this phase and report the feature as integration-ready only.
- **Concurrent-edit collision:** shell, expediente, and gallery work may proceed in parallel. Mitigation: enforce the protected-path boundary and confine changes to the new vitales module.

## Rollback

Rollback is deletion of the newly added `src/features/vitales/**` files. Because Phase A changes no schema, content, dependency, shell, registry, or application integration path, rollback requires no data migration, compatibility shim, or restoration of protected files.

## Review workload forecast

- Estimated changed lines: approximately **300–380**, primarily new feature code and focused tests.
- Review budget: **400 changed lines**.
- Budget risk: **Medium-low**, with limited headroom.
- Chained PRs recommended: **No** for the proposed Phase A slice.
- Decision needed before apply: **Only if** task refinement forecasts more than 400 changed lines or expands beyond `src/features/vitales/**`.

To stay within the review budget, tests should be focused rather than duplicative: one component-level suite may cover `VitalSigns` and `StatCard` variant rendering, while pure formatting/progress rules receive a separate unit suite. Scope must be reduced or explicitly re-approved before apply if the forecast crosses 400 lines.

## Follow-on work

A later, separately authorized integration phase may connect `VitalSigns` to validated `statsContent`, register it in the narrative shell/sections flow, perform application-level responsive checks, and determine whether Issue #10 can be closed. That phase must coordinate with the owners of currently protected paths and is not implied by acceptance of this proposal.
