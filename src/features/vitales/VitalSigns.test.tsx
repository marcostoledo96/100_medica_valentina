import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StatCollectionSchema } from '../../domain/schemas/stats.schema';
import { VitalSigns } from './index';
const statsFixture = StatCollectionSchema.parse([
  { id: 'fixture-number', label: 'Horas de estudio', value: 1200, format: 'number' },
  { id: 'fixture-percentage', label: 'Nivel de cafeína', value: '99.9%', format: 'percentage' },
  { id: 'fixture-text', label: 'Diagnóstico', value: 'Aprobada', format: 'text' },
  { id: 'fixture-progress', label: 'Recuperación', value: 75, format: 'progress' },
]);
describe('VitalSigns', () => {
  it('renders a named non-region wrapper, mobile grid, all formats, and input order', () => {
    render(<VitalSigns stats={statsFixture} heading="Panel de signos" />);
    const section = screen.getByTestId('vital-signs');
    const heading = within(section).getByRole('heading', { level: 2, name: 'Panel de signos' });
    const list = within(section).getByRole('list');
    const articles = within(list).getAllByRole('article');
    expect(section.tagName).toBe('DIV');
    expect(section).toHaveAttribute('aria-labelledby', heading.id);
    expect(screen.queryByRole('region', { name: 'Panel de signos' })).not.toBeInTheDocument();
    expect(list).toHaveClass('grid', 'grid-cols-1', 'gap-3', 'sm:grid-cols-2');
    expect(list.className).not.toMatch(/grid-cols-[3-9]/);
    expect(articles).toHaveLength(4);
    expect(
      articles.map((article) => within(article).getByRole('heading', { level: 3 }).textContent)
    ).toEqual(statsFixture.map((stat) => stat.label));
    expect(screen.getByText('1.200', { exact: true })).toBeVisible();
    expect(screen.getByText('99.9%', { exact: true })).toBeVisible();
    expect(screen.getByText('Aprobada', { exact: true })).toBeVisible();
    expect(screen.getByText('75', { exact: true })).toBeVisible();
  });
  it('preserves frozen input and keeps long content inside overflow boundaries', () => {
    const frozenStats = Object.freeze(statsFixture.map((stat) => Object.freeze({ ...stat })));
    const beforeRender = frozenStats.map((stat) => ({ ...stat }));
    render(<VitalSigns stats={frozenStats} />);
    const section = screen.getByTestId('vital-signs');
    const list = within(section).getByRole('list');
    const article = within(list).getAllByRole('article')[0]!;
    const value = within(article).getByText('1.200', { exact: true });
    expect(frozenStats).toEqual(beforeRender);
    expect(section).toHaveClass('w-full');
    expect(list).toHaveClass('w-full');
    expect(within(list).getAllByRole('listitem')[0]).toHaveClass('min-w-0');
    expect(article).toHaveClass('w-full', 'min-w-0', 'overflow-hidden');
    expect(value).toHaveClass('min-w-0', 'break-words');
  });
  it('renders the same immediate user-visible content with reduced motion', () => {
    const normal = render(<VitalSigns stats={statsFixture} heading="Lectura" />);
    const normalReadback = screen.getByTestId('vital-signs').textContent;
    normal.unmount();
    const originalMatchMedia = window.matchMedia;
    const reducedMotionMedia: MediaQueryList = {
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    window.matchMedia = vi.fn(() => reducedMotionMedia);
    try {
      render(<VitalSigns stats={statsFixture} heading="Lectura" />);
      expect(screen.getByTestId('vital-signs').textContent).toBe(normalReadback);
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });
});
