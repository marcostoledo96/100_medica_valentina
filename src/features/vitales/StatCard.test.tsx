import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatSchema, type Stat } from '../../domain/schemas/stats.schema';
import { StatCard, statPresentation } from './index';
type StatExtras = Partial<Pick<Stat, 'unit' | 'note' | 'humorous'>>;
function makeStat(
  id: string,
  label: string,
  value: Stat['value'],
  format: Stat['format'],
  extras: StatExtras = {}
) {
  return StatSchema.parse({ id, label, value, format, ...extras });
}
const numberStat = makeStat('fixture-number', 'Horas', 1200, 'number');
const numberWithUnit = makeStat('fixture-hours', 'Horas', 1200, 'number', { unit: 'hs' });
const percentageStat = makeStat('fixture-percentage', 'Cafeína', '99.9%', 'percentage');
const textStat = makeStat('fixture-text', 'Diagnóstico', 'Aprobada con honores', 'text');
const progressStat = makeStat('fixture-progress', 'Recuperación', 100, 'progress', { unit: '%' });
describe('StatCard', () => {
  it('renders localized number values and composes an optional unit once', () => {
    const { rerender } = render(<StatCard stat={numberStat} />);
    expect(screen.getByText('1.200', { exact: true })).toBeVisible();
    rerender(<StatCard stat={numberWithUnit} />);
    expect(screen.getByText('1.200 hs', { exact: true })).toBeVisible();
  });
  it('renders percentage and text values exactly as supplied', () => {
    const { rerender } = render(<StatCard stat={percentageStat} />);
    expect(screen.getByText('99.9%', { exact: true })).toBeVisible();
    rerender(<StatCard stat={textStat} />);
    expect(screen.getByText('Aprobada con honores', { exact: true })).toBeVisible();
  });
  it('names the article by its label and exposes numeric progress semantics without format badges', () => {
    render(<StatCard stat={progressStat} />);
    const label = screen.getByRole('heading', { level: 3, name: progressStat.label });
    const article = screen.getByRole('article', { name: progressStat.label });
    const progress = screen.getByRole('progressbar', { name: progressStat.label });
    expect(article).toHaveAttribute('aria-labelledby', label.id);
    expect(screen.getByText('100 %', { exact: true })).toBeVisible();
    for (const formatLabel of ['Número', 'Porcentaje', 'Texto', 'Progreso']) {
      expect(screen.queryByText(formatLabel, { exact: true })).not.toBeInTheDocument();
    }
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress).toHaveAttribute('aria-valuenow', '100');
    expect(progress).toHaveStyle({ width: '100%' });
    expect(article.querySelectorAll('button, a, input, select, textarea, [tabindex]')).toHaveLength(
      0
    );
  });
  it('passes a schema-valid progress value through to visible and numeric semantics', () => {
    const authoredProgress = StatSchema.parse({
      ...progressStat,
      id: 'fixture-authored',
      value: 42.5,
    });
    render(<StatCard stat={authoredProgress} />);
    expect(screen.getByText('42,5 %', { exact: true })).toBeVisible();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42.5');
    expect(screen.getByRole('progressbar')).toHaveStyle({ width: '42.5%' });
  });
  it('renders notes and parody disclosure only when supplied', () => {
    const noted = StatSchema.parse({
      ...numberStat,
      id: 'fixture-noted',
      note: 'Apunte de seguimiento',
      humorous: true,
    });
    const { rerender } = render(<StatCard stat={noted} />);
    expect(screen.getByText('Apunte de seguimiento', { exact: true })).toBeVisible();
    expect(screen.getByText(statPresentation.humorDisclosure, { exact: true })).toBeVisible();
    rerender(<StatCard stat={numberStat} />);
    expect(screen.queryByText('Apunte de seguimiento', { exact: true })).not.toBeInTheDocument();
    expect(
      screen.queryByText(statPresentation.humorDisclosure, { exact: true })
    ).not.toBeInTheDocument();
  });
});
