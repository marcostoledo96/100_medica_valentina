import { test, expect } from './narrative-test';

test.describe('Timeline E2E', () => {
  test('renders multiple authored entries at the native timeline fragment', async ({ page }) => {
    await page.goto('/#linea-tiempo');

    const timelineSection = page.getByRole('region', { name: 'Línea de tiempo' });
    const timeline = page.getByTestId('timeline');

    await expect(page).toHaveURL(/#linea-tiempo$/);
    await expect(timelineSection).toBeVisible();
    await expect(timeline).toBeVisible();
    await expect(timeline.getByRole('list')).toBeVisible();
    await expect(timeline.getByRole('article')).toHaveCount(3);
    await expect(timeline.getByRole('heading', { level: 3 }).first()).toHaveText(
      'Hito Académico Demo 1'
    );
    await expect(timeline.getByRole('heading', { level: 3 }).last()).toHaveText(
      'Hito Milestone Demo 3'
    );
    await expect(timeline.getByText('Académico', { exact: true })).toBeVisible();
    await expect(timeline.getByText('Hospital', { exact: true })).toBeVisible();
    await expect(timeline.getByText('Hito', { exact: true })).toBeVisible();
  });

  test('supports a direct native fragment to an existing timeline entry', async ({ page }) => {
    await page.goto('/#timeline-entry-demo-stage-02');

    const target = page.getByRole('article', { name: 'Hito Hospitalario Demo 2' });

    await expect(page).toHaveURL(/#timeline-entry-demo-stage-02$/);
    await expect(target).toHaveAttribute('id', 'timeline-entry-demo-stage-02');
    await expect(target).toBeVisible();
    await expect(target).toBeInViewport();
  });

  test('keeps every timeline entry visible with reduced motion enabled', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#linea-tiempo');

    const timeline = page.getByTestId('timeline');
    const entries = timeline.getByRole('article');

    await expect(timeline).toBeVisible();
    await expect(entries).toHaveCount(3);

    for (const entry of await entries.all()) {
      await expect(entry).toBeVisible();
    }
  });
});
