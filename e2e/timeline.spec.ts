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

  test('keeps timeline content visible with reduced motion enabled', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#linea-tiempo');

    const timeline = page.getByTestId('timeline');

    await expect(timeline).toBeVisible();
    await expect(timeline.getByRole('article')).toHaveCount(3);
    await expect(timeline.getByRole('heading', { level: 3 }).first()).toBeVisible();
  });
});
