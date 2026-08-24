---
name: frontend-design
description: >-
  Expert guidance for building distinctive, production-grade, anti-AI-slop web interfaces.
  Use when designing or implementing React components, UI layouts, styling, typography,
  micro-interactions, and visual systems that avoid generic AI templates.
---

# Frontend Design & Anti-AI-Slop Skill

This skill enforces intentional, high-end visual design and frontend craftsmanship, preventing generic "AI slop" aesthetics (boring purple gradients, cookie-cutter cards, predictable layouts).

---

## 1. Core Philosophy: Intentionality & Personality

1. **Commit to a Strong Aesthetic Anchor:**
   - Never build "generic modern SaaS" unless explicitly asked.
   - For **%100 médica**, we master a dual aesthetic progression:
     - **Phase 1 (Clinical/System Precision):** High-density monospace telemetry, crisp border grids, muted surgical slate/carbon background, subtle monitor greens (`#10b981`, `#06b6d4`), clinical badges.
     - **Phase 2 (Nostalgic Scrapbook & Warmth):** Textured warm paper (`#faf7f2`, `#f4ede4`), organic rotation tilts (`-1.5deg`, `+2deg`), polaroid frames, drop shadows with soft blur, tape stickers, handwritten accent notes.
     - **Phase 3 (Cinematic Finale):** Bold editorial typography, full-bleed hero visuals, celebratory accents, clean uncluttered closure.

2. **Typography with Real Hierarchy:**
   - Avoid using the same generic sans-serif for everything.
   - Combine 3 deliberate type roles:
     - **Display / Editorial:** Warm editorial serif or distinctive modern grotesque for emotional headlines.
     - **Data / Clinical:** Monospace or tabular numerals for timestamps, exam grades, vital stats, patient IDs.
     - **Body / Interface:** Clean, highly legible sans for story paragraphs, captions, and microcopy.

3. **Bespoke Color & Surface Depth:**
   - Avoid generic `bg-gray-100` and `bg-blue-500`.
   - Build deliberate surface hierarchies:
     - Clinical dark: Deep slate/obsidian (`#0a0f14`), subtle border borders (`border-emerald-500/20`), glow accents.
     - Scrapbook warm: Off-white parchment, vintage tape accents, corkboard or subtle grain.

---

## 2. Micro-Interactions & Framer Motion Guidelines

1. **Purposeful Transitions:**
   - Transitions should communicate physical weight or clinical responsiveness.
   - Duration standard: `150ms` to `300ms` for UI actions; `400ms` to `700ms` for narrative reveals.
   - Spring physics: `stiffness: 300, damping: 25` for tactile buttons.

2. **Tactile Feedback:**
   - Use subtle active states (`scale(0.97)`, `translate-y-[1px]`) on touch.
   - Support `navigator.vibrate([15])` on mobile for key milestone interactions (achievements, secret taps).

3. **Accessibility First (Reduced Motion):**
   - Always wrap motion components with respect for `useReducedMotion()` or CSS `@media (prefers-reduced-motion: reduce)`.
   - In reduced motion mode: immediate opacity transitions (`fade-in`), count-up numbers render final value immediately.

---

## 3. Mobile-First Craftsmanship

- **Viewport Target:** Strict testing on 360px (compact Android), 390px (iPhone standard), 430px (iPhone Max).
- **One-Hand Usability:** Primary actions placed in bottom 60% of viewport.
- **Touch Targets:** Absolute minimum `44x44px` bounding box for all interactive buttons and triggers.
- **Scroll Fidelity:** Never hijack the native scroll engine with heavy JavaScript wheels. Use CSS scroll snap (`scroll-snap-type: x mandatory`) for horizontal carousels.
