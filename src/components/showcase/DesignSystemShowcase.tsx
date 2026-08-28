import React, { useState } from 'react';
import type { ExperiencePhase } from '../../domain/types/phase';
import { useExperiencePhase } from '../../hooks/useExperiencePhase';
import { Button } from '../ui/Button/Button';
import { IconButton } from '../ui/IconButton/IconButton';
import { Card } from '../ui/Card/Card';
import { Section } from '../ui/Section/Section';
import { VisuallyHidden } from '../ui/VisuallyHidden/VisuallyHidden';

const CheckIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const HeartIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export const DesignSystemShowcase: React.FC = () => {
  const { phase, setPhase } = useExperiencePhase();
  const [clickCount, setClickCount] = useState(0);
  const [simulatedLoading, setSimulatedLoading] = useState(false);

  const handleSimulateLoad = () => {
    setSimulatedLoading(true);
    setTimeout(() => setSimulatedLoading(false), 1200);
  };

  return (
    <div className="w-full min-h-screen bg-surface-base text-text-primary transition-colors duration-normal safe-area-inset">
      {/* Top Header / Phase Controller */}
      <header className="sticky top-0 z-30 w-full bg-surface-raised border-b border-border-default px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse" />
            <h1 className="text-base font-ui font-bold tracking-tight">Design System Showcase</h1>
            <span className="text-xs font-mono text-text-muted px-2 py-0.5 bg-surface-subtle rounded border border-border-subtle">
              v0.1.0
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 p-1 bg-surface-base rounded-md border border-border-default"
            role="group"
            aria-label="Phase selector"
          >
            {(['clinical', 'human', 'finale'] as ExperiencePhase[]).map((p) => {
              const isActive = phase === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhase(p)}
                  aria-pressed={isActive}
                  className={`px-3 py-1.5 min-h-[44px] text-xs font-mono font-medium rounded capitalize transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                    isActive
                      ? 'bg-accent-primary text-accent-primary-fg shadow-subtle font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main id="experience-root" className="w-full">
        {/* Section 1: Phase Atmosphere Overview */}
        <Section as="section" containerWidth="lg" paddingY="md" aria-labelledby="phase-heading">
          <div className="space-y-6">
            <div>
              <h2
                id="phase-heading"
                className="text-2xl sm:text-3xl font-display font-bold tracking-tight"
              >
                Active Atmosphere:{' '}
                <span className="text-accent-primary uppercase tracking-wider">{phase}</span>
              </h2>
              <p className="mt-1 text-sm text-text-secondary font-ui">
                Dynamic tokens update colors, borders, typography emphasis, and elevations without
                altering underlying component APIs.
              </p>
            </div>

            {/* Token Swatch Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card variant="raised" padding="sm" className="space-y-2">
                <div className="h-10 w-full rounded bg-surface-base border border-border-default flex items-center justify-center text-xs font-mono text-text-muted">
                  Base
                </div>
                <p className="text-xs font-ui font-medium text-text-secondary">Surface Base</p>
              </Card>

              <Card variant="raised" padding="sm" className="space-y-2">
                <div className="h-10 w-full rounded bg-surface-raised border border-border-default flex items-center justify-center text-xs font-mono text-text-primary">
                  Raised
                </div>
                <p className="text-xs font-ui font-medium text-text-secondary">Surface Raised</p>
              </Card>

              <Card variant="raised" padding="sm" className="space-y-2">
                <div className="h-10 w-full rounded bg-accent-primary flex items-center justify-center text-xs font-mono text-accent-primary-fg font-semibold shadow-glow">
                  Accent Primary
                </div>
                <p className="text-xs font-ui font-medium text-text-secondary">Accent Primary</p>
              </Card>

              <Card variant="raised" padding="sm" className="space-y-2">
                <div className="h-10 w-full rounded bg-status-success flex items-center justify-center text-xs font-mono text-status-success-fg font-semibold">
                  Success
                </div>
                <p className="text-xs font-ui font-medium text-text-secondary">Status Success</p>
              </Card>
            </div>
          </div>
        </Section>

        {/* Section 2: Typography System */}
        <Section
          as="section"
          containerWidth="lg"
          paddingY="sm"
          aria-labelledby="typography-heading"
        >
          <Card variant="default" padding="lg" className="space-y-6">
            <h2
              id="typography-heading"
              className="text-lg font-ui font-bold text-text-primary border-b border-border-subtle pb-2"
            >
              Typography Hierarchy
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-text-muted block mb-1">
                  font-display (Editorial / Emotional Headlines)
                </span>
                <p className="text-2xl sm:text-4xl font-display font-bold leading-tight">
                  The Clinical Record & Journey
                </p>
              </div>

              <div>
                <span className="text-xs font-mono text-text-muted block mb-1">
                  font-ui (Interface / Story Paragraphs)
                </span>
                <p className="text-base font-ui text-text-secondary leading-relaxed">
                  Mobile-first typography tuned for high legibility, balanced line-height, and
                  predictable vertical rhythm on small viewports.
                </p>
              </div>

              <div>
                <span className="text-xs font-mono text-text-muted block mb-1">
                  font-mono (Telemetry / Clinical Data)
                </span>
                <p className="text-sm font-mono text-accent-primary bg-surface-subtle p-3 rounded border border-border-subtle inline-block">
                  BP: 120/80 mmHg | HR: 72 bpm | PROTOCOL: STATUS_NOMINAL
                </p>
              </div>

              <div>
                <span className="text-xs font-mono text-text-muted block mb-1">
                  font-handwriting (Scrapbook Accent Note)
                </span>
                <p className="text-lg font-handwriting text-text-primary">
                  Note: Clinical observation registered on rotation record.
                </p>
              </div>
            </div>
          </Card>
        </Section>

        {/* Section 3: Interactive Button Primitives */}
        <Section as="section" containerWidth="lg" paddingY="md" aria-labelledby="buttons-heading">
          <div className="space-y-6">
            <div>
              <h2 id="buttons-heading" className="text-xl font-ui font-bold text-text-primary">
                Button Primitives
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                All interactive targets enforce minimum 44×44px touch bounding boxes.
              </p>
            </div>

            <Card variant="raised" padding="md" className="space-y-6">
              {/* Button Variants */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-text-muted uppercase tracking-wider block">
                  Variants
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={() => setClickCount((c) => c + 1)}
                    data-testid="showcase-btn-primary"
                  >
                    <CheckIcon />
                    Primary Action
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => setClickCount((c) => c + 1)}
                    data-testid="showcase-btn-secondary"
                  >
                    Secondary Action
                  </Button>

                  <Button variant="outline" onClick={() => setClickCount((c) => c + 1)}>
                    Outline Action
                  </Button>

                  <Button variant="ghost" onClick={() => setClickCount((c) => c + 1)}>
                    Ghost Action
                  </Button>

                  <Button variant="danger" onClick={() => setClickCount((c) => c + 1)}>
                    Danger Action
                  </Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div className="space-y-3 border-t border-border-subtle pt-4">
                <span className="text-xs font-mono text-text-muted uppercase tracking-wider block">
                  Sizes (All ≥ 44px touch target)
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" variant="secondary">
                    Small (sm)
                  </Button>
                  <Button size="md" variant="secondary">
                    Medium (md)
                  </Button>
                  <Button size="lg" variant="secondary">
                    Large (lg)
                  </Button>
                </div>
              </div>

              {/* Button States */}
              <div className="space-y-3 border-t border-border-subtle pt-4">
                <span className="text-xs font-mono text-text-muted uppercase tracking-wider block">
                  States
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button disabled variant="primary">
                    Disabled Primary
                  </Button>

                  <Button
                    variant="primary"
                    isLoading={simulatedLoading}
                    onClick={handleSimulateLoad}
                  >
                    {simulatedLoading ? 'Processing...' : 'Simulate Loading'}
                  </Button>

                  <span className="text-xs font-mono text-text-muted self-center ml-2">
                    Click counter: <strong className="text-text-primary">{clickCount}</strong>
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        {/* Section 4: IconButton Primitives */}
        <Section as="section" containerWidth="lg" paddingY="sm" aria-labelledby="icon-btn-heading">
          <div className="space-y-6">
            <div>
              <h2 id="icon-btn-heading" className="text-xl font-ui font-bold text-text-primary">
                IconButton Primitives
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Strict contract: accessible name (label) is mandatory in TypeScript.
              </p>
            </div>

            <Card variant="default" padding="md">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <IconButton
                    label="Confirm clinical check"
                    variant="primary"
                    icon={<CheckIcon />}
                    data-testid="showcase-icon-btn-check"
                  />
                  <span className="text-xs font-mono text-text-muted">Primary</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <IconButton
                    label="Add to favorites"
                    variant="secondary"
                    icon={<HeartIcon />}
                    data-testid="showcase-icon-btn-heart"
                  />
                  <span className="text-xs font-mono text-text-muted">Secondary</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <IconButton
                    label="Search records"
                    variant="outline"
                    icon={<SearchIcon />}
                    data-testid="showcase-icon-btn-search"
                  />
                  <span className="text-xs font-mono text-text-muted">Outline</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <IconButton
                    label="Trigger celebration effect"
                    variant="ghost"
                    icon={<SparklesIcon />}
                    data-testid="showcase-icon-btn-sparkles"
                  />
                  <span className="text-xs font-mono text-text-muted">Ghost</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <IconButton
                    label="Disabled search"
                    variant="outline"
                    disabled
                    icon={<SearchIcon />}
                  />
                  <span className="text-xs font-mono text-text-muted">Disabled</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <IconButton
                    label="Loading item"
                    variant="primary"
                    isLoading
                    icon={<CheckIcon />}
                  />
                  <span className="text-xs font-mono text-text-muted">Loading</span>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        {/* Section 5: Card & Composition Primitives */}
        <Section as="section" containerWidth="lg" paddingY="md" aria-labelledby="cards-heading">
          <div className="space-y-6">
            <h2 id="cards-heading" className="text-xl font-ui font-bold text-text-primary">
              Card Surface & Composition
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card variant="default" padding="md" as="article">
                <span className="text-xs font-mono text-text-muted block">variant="default"</span>
                <h3 className="text-base font-ui font-semibold text-text-primary mt-1">
                  Standard Surface
                </h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Default raised container with subtle border for structured clinical modules.
                </p>
              </Card>

              <Card variant="raised" padding="md" as="article">
                <span className="text-xs font-mono text-text-muted block">variant="raised"</span>
                <h3 className="text-base font-ui font-semibold text-text-primary mt-1">
                  Elevated Surface
                </h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Higher elevation and shadow for highlighted milestones and active selections.
                </p>
              </Card>

              <Card variant="outlined" padding="md" as="article">
                <span className="text-xs font-mono text-text-muted block">variant="outlined"</span>
                <h3 className="text-base font-ui font-semibold text-text-primary mt-1">
                  Outlined Surface
                </h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Crisp border with base surface background for subtle containment.
                </p>
              </Card>

              <Card variant="subtle" padding="md" as="article">
                <span className="text-xs font-mono text-text-muted block">variant="subtle"</span>
                <h3 className="text-base font-ui font-semibold text-text-primary mt-1">
                  Subtle Surface
                </h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Muted background with low contrast border for ancillary information.
                </p>
              </Card>
            </div>
          </div>
        </Section>

        {/* Section 6: Accessibility & Safe Area Verification */}
        <Section as="section" containerWidth="lg" paddingY="md" aria-labelledby="a11y-heading">
          <Card variant="default" padding="lg" className="space-y-4">
            <h2 id="a11y-heading" className="text-lg font-ui font-bold text-text-primary">
              Accessibility & Safe Areas
            </h2>

            <div className="space-y-3 text-xs text-text-secondary font-ui">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-success shrink-0" />
                <span>
                  <strong>VisuallyHidden Helper:</strong> Screen-reader only text available below.
                </span>
                <VisuallyHidden>
                  Screen-reader audit verified: VisuallyHidden text correctly parsed.
                </VisuallyHidden>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-success shrink-0" />
                <span>
                  <strong>Touch Targets:</strong> Verified minimum 44×44px bounding box on all
                  buttons.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-success shrink-0" />
                <span>
                  <strong>Keyboard Focus:</strong> Clear 2px focus ring with offset across all
                  elements.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-success shrink-0" />
                <span>
                  <strong>Safe Areas:</strong> Integrated `env(safe-area-inset-*)` utilities active.
                </span>
              </div>
            </div>
          </Card>
        </Section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border-default py-6 text-center text-xs font-mono text-text-muted">
        <p>%100 médica — Design System Foundation</p>
      </footer>
    </div>
  );
};
