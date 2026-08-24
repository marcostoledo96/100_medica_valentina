---
name: gentle-sdd-react
description: >-
  Gentle AI Spec-Driven Development (SDD) guide tailored for React single-page frontend.
  Enforces clean component boundaries, decoupled data layers, quality gates, and atomic testing.
---

# Gentle AI SDD for React Single-Page Applications

This skill guides the implementation of React frontend features following the Gentle AI Spec-Driven Development (SDD) lifecycle.

---

## 1. SDD Lifecycle for Frontend Features

Every feature progresses through a disciplined cycle:

1. **Spec & Contract:**
   - Define TypeScript interfaces and Zod schemas in `src/domain/schemas/`.
   - Ensure component props are decoupled from content sources.
2. **Data & Fixture:**
   - Create mock/fixture data modules in `src/content/`.
   - Validate data against the Zod schema at compile time or test initialization.
3. **Presentational Primitives:**
   - Build dumb, purely visual components in `src/components/ui/` or `src/features/<feature>/components/`.
   - Verify mobile viewport rendering (360px–430px) and accessibility (ARIA labels, keyboard focus).
4. **Interactive Container:**
   - Connect state, hooks, audio, and Framer Motion transitions.
5. **Quality Gates & Tests:**
   - Unit tests with Vitest + Testing Library for logic and UI interactions.
   - Run typecheck and linting before marking tasks complete.

---

## 2. Decoupled Content Layer Architecture

```ts
// 1. Schema (src/domain/schemas/profile.schema.ts)
import { z } from 'zod';

export const ProfileSchema = z.object({
  firstName: z.string(),
  fullName: z.string(),
  startYear: z.number(),
  graduationYear: z.number(),
  portrait: z.string(),
  status: z.string(),
  diagnosis: z.string(),
  prognosis: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;

// 2. Data Module (src/content/profile.ts)
import { Profile, ProfileSchema } from '../domain/schemas/profile.schema';

export const profileContent: Profile = ProfileSchema.parse({
  firstName: "Valentina",
  fullName: "Valentina [Apellido]",
  startYear: 2018,
  graduationYear: 2026,
  portrait: "/images/profile/portrait.webp",
  status: "ALTA DEFINITIVA",
  diagnosis: "MÉDICA (UBA)",
  prognosis: "FUTURO BRILLANTE",
});
```

---

## 3. Git Discipline & Quality Assurance

- **Conventional Commits:** `feat(scope): message`, `fix(scope): message`, `test(scope): message`, `chore(scope): message`.
- **Zero AI Attribution:** Never add `Co-Authored-By` or AI tags in commit logs.
- **Verification Commands:**
  ```bash
  npm run lint
  npm run typecheck
  npm test
  npm run build
  ```
