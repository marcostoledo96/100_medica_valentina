import { expect, test } from './narrative-test';

const mobileViewports = [
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
] as const;

test.describe('Finale scene', () => {
  test('reaches the finale through its native fragment with diagnosis before discharge', async ({
    page,
  }) => {
    await page.goto('/#final');

    const finale = page.getByTestId('finale-scene');
    const stages = finale.locator('[data-finale-stage]');

    await expect(page).toHaveURL(/#final$/);
    await expect(page.locator('[data-experience-phase]')).toHaveAttribute(
      'data-experience-phase',
      'finale'
    );
    await expect(page.getByRole('region', { name: 'Final' })).toBeVisible();
    await expect(stages).toHaveCount(2);
    await expect(stages.nth(0)).toHaveAttribute('data-finale-stage', 'diagnosis');
    await expect(stages.nth(1)).toHaveAttribute('data-finale-stage', 'discharge');
    await expect(finale.getByRole('heading', { level: 2, name: 'MÉDICA DEMO' })).toBeVisible();
    await expect(
      finale.getByRole('heading', { level: 2, name: '¡Felicitaciones Médica!' })
    ).toBeVisible();
    await expect(finale.getByText('Persona Demo de Prueba', { exact: true })).toBeVisible();
    await expect(finale.getByText('2026-12-15', { exact: true })).toBeVisible();
    await expect(finale.getByRole('img')).toBeVisible();
    await expect(page.locator('audio')).toHaveCount(0);
  });

  test('returns to the beginning through a real focused anchor', async ({ page }) => {
    await page.goto('/#final');

    const returnLink = page.getByRole('link', { name: 'Volver al inicio' });
    await expect(returnLink).toHaveAttribute('href', '#inicio');

    await returnLink.focus();
    await expect(returnLink).toBeFocused();
    const hasVisibleFocus = await returnLink.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return (
        styles.outlineStyle !== 'none' ||
        parseFloat(styles.outlineWidth) > 0 ||
        styles.boxShadow !== 'none'
      );
    });
    expect(hasVisibleFocus).toBe(true);

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/#inicio$/);
    await expect(page.locator('[data-experience-phase]')).toHaveAttribute(
      'data-experience-phase',
      'clinical'
    );
    await expect(page.getByRole('heading', { level: 1, name: 'Inicio' })).toBeVisible();
  });

  test('keeps both finale stages immediately available with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#final');

    const finale = page.getByTestId('finale-scene');
    await expect(finale.locator('[data-finale-stage="diagnosis"]')).toBeVisible();
    await expect(finale.locator('[data-finale-stage="discharge"]')).toBeVisible();

    const motionStyles = await finale.locator('[data-finale-stage]').evaluateAll((elements) =>
      elements.map((element) => {
        const styles = window.getComputedStyle(element);
        return [styles.animationName, styles.transform];
      })
    );
    expect(motionStyles).toEqual([
      ['none', 'none'],
      ['none', 'none'],
    ]);
  });

  test('fits every required mobile viewport without horizontal overflow', async ({ page }) => {
    for (const viewport of mobileViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/#final');

      await expect(page.getByTestId('finale-scene')).toBeVisible();

      const { clientWidth, scrollWidth } = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(scrollWidth, `Horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(
        clientWidth
      );

      const returnLink = page.getByRole('link', { name: 'Volver al inicio' });
      const box = await returnLink.boundingBox();
      expect(box?.width ?? 0, `CTA width at ${viewport.width}px`).toBeGreaterThanOrEqual(44);
      expect(box?.height ?? 0, `CTA height at ${viewport.width}px`).toBeGreaterThanOrEqual(44);
    }
  });
});
