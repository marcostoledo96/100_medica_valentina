import { expect, test } from './narrative-test';

const finaleImageAlt = 'Fotografía emotiva de festejo y celebración de graduación médica.';

const requiredViewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 1280, height: 800 },
] as const;

test.describe('Finale scene', () => {
  test('reaches the finale through its native fragment', async ({ page }) => {
    await page.goto('/#final');

    const finale = page.getByTestId('finale-scene');

    await expect(finale).toHaveAttribute('data-content-status', 'provisional');
    await expect(page.locator('[data-experience-phase]')).toHaveAttribute(
      'data-experience-phase',
      'finale'
    );
    await expect(finale.getByRole('heading', { level: 2, name: 'MÉDICA DEMO' })).toBeVisible();
    await expect(
      finale.getByRole('heading', { level: 2, name: '¡Felicitaciones Médica!' })
    ).toBeVisible();
    await expect(finale.getByRole('img')).toBeVisible();
    await expect(page.locator('audio')).toHaveCount(0);
  });

  test('swaps the unavailable finale image for the accessible placeholder', async ({ page }) => {
    await page.route('**/images/demo/finale.webp', (route) =>
      route.fulfill({ status: 200, contentType: 'image/webp', body: '' })
    );
    await page.goto('/#final');
    await page.locator('[data-finale-stage="discharge"]').scrollIntoViewIfNeeded();

    const finale = page.getByTestId('finale-scene');
    const fallback = finale.getByTestId('finale-image-fallback');

    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveAttribute('data-content-status', 'placeholder');
    await expect(fallback).toHaveAttribute('aria-label', finaleImageAlt);
    await expect(fallback).toContainText('Imagen no disponible');
    await expect(finale.locator('img')).toHaveCount(0);
  });

  test('returns to the beginning through a real focused anchor', async ({ page }) => {
    await page.goto('/#final');

    const returnLink = page.getByRole('link', { name: 'Volver al comienzo' });
    await expect(returnLink).toHaveAttribute('href', '#inicio');
    await expect(page.getByRole('link', { name: 'Inicio' })).toHaveCount(1);

    await returnLink.focus();
    await expect(returnLink).toBeFocused();
    const focusStyles = await returnLink.evaluate((element) => {
      const s = window.getComputedStyle(element);
      return s.outlineStyle !== 'none' || parseFloat(s.outlineWidth) > 0 || s.boxShadow !== 'none';
    });
    expect(focusStyles).toBe(true);

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/#inicio$/);
    await expect(page.locator('[data-experience-phase]')).toHaveAttribute(
      'data-experience-phase',
      'clinical'
    );
  });

  test('keeps both finale stages immediately available with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#final');

    const finale = page.getByTestId('finale-scene');
    await expect(finale.locator('[data-finale-stage="diagnosis"]')).toBeVisible();
    await expect(finale.locator('[data-finale-stage="discharge"]')).toBeVisible();
    await expect(finale.getByRole('link', { name: 'Volver al comienzo' })).toBeVisible();

    const motionStyles = await finale
      .locator('[data-finale-stage]')
      .evaluateAll((stages) =>
        stages.map((stage) => [
          getComputedStyle(stage).animationName,
          getComputedStyle(stage).transform,
        ])
      );
    expect(motionStyles.every(([name, transform]) => name === 'none' && transform === 'none')).toBe(
      true
    );
  });

  test('fits required viewports without overflow or mid-word headline breaks', async ({ page }) => {
    for (const viewport of requiredViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/#final');
      await expect(page.getByTestId('finale-scene')).toBeVisible();
      // 0 = headline wraps only at word boundaries ("¡Felicitaciones" / "Médica!"), never mid-word.
      const { overflow, midWordBreaks } = await page.evaluate(() => {
        const { clientWidth, scrollWidth } = document.documentElement;
        const heading = document.getElementById('finale-heading');
        const node = heading?.firstChild;
        const lineCount = (range: Range) =>
          new Set(
            [...range.getClientRects()]
              .filter((rect) => rect.height > 0)
              .map((rect) => Math.round(rect.top))
          ).size;
        let breaks = 0;
        for (const match of (node?.textContent ?? '').matchAll(/\S+/g)) {
          const range = document.createRange();
          range.setStart(node!, match.index);
          range.setEnd(node!, match.index + match[0].length);
          breaks += Math.max(0, lineCount(range) - 1);
        }
        return { overflow: scrollWidth - clientWidth, midWordBreaks: breaks };
      });
      expect(overflow, `Horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(0);
      expect(midWordBreaks, `Mid-word headline break at ${viewport.width}px`).toBe(0);

      const returnLink = page.getByRole('link', { name: 'Volver al comienzo' });
      const box = await returnLink.boundingBox();
      expect(box?.width ?? 0, `CTA width at ${viewport.width}px`).toBeGreaterThanOrEqual(44);
      expect(box?.height ?? 0, `CTA height at ${viewport.width}px`).toBeGreaterThanOrEqual(44);
    }
  });

  test('traverses boot, expediente, and finale as one mobile journey', async ({ page }) => {
    await page.goto('/');
    const phase = page.locator('[data-experience-phase]');
    const boot = page.locator('[data-boot-scene="true"]');

    await boot.getByRole('link', { name: 'Abrir expediente' }).click();
    await expect(page).toHaveURL(/#expediente$/);
    await expect(page.getByTestId('expediente-scene')).toBeVisible();
    await expect(phase).toHaveAttribute('data-experience-phase', 'clinical');

    await page.getByRole('link', { name: 'Ver evolución' }).click();
    await expect(page).toHaveURL(/#signos-vitales$/);
    await expect(page.getByTestId('vital-signs')).toBeVisible();

    await page.locator('[data-section-link="linea-tiempo"]').click();
    await expect(page.getByTestId('timeline')).toBeVisible();
    await expect(phase).toHaveAttribute('data-experience-phase', 'human');

    await page.locator('[data-section-link="galeria"]').click();
    await expect(page.getByTestId('gallery')).toBeVisible();

    await page.locator('[data-section-link="equipo-tratante"]').click();
    await expect(page).toHaveURL(/#equipo-tratante$/);
    const team = page.getByTestId('team');
    await expect(team).toBeVisible();
    await expect(team.getByRole('heading', { level: 2, name: 'Equipo tratante' })).toBeVisible();
    await expect(phase).toHaveAttribute('data-experience-phase', 'human');

    await page.locator('[data-section-link="final"]').click();
    await expect(page).toHaveURL(/#final$/);
    await expect(phase).toHaveAttribute('data-experience-phase', 'finale');
    await expect(page.getByTestId('finale-scene')).toBeVisible();

    const stages = page.getByTestId('finale-scene').locator('[data-finale-stage]');
    await expect(stages).toHaveCount(2);
    await expect(stages.nth(0)).toHaveAttribute('data-finale-stage', 'diagnosis');
    await expect(stages.nth(1)).toHaveAttribute('data-finale-stage', 'discharge');

    // Team must render before the Finale in document order (full-journey guard).
    const teamBeforeFinale = await page.evaluate(() => {
      const team = document.querySelector('[data-testid="team"]');
      const finale = document.querySelector('[data-testid="finale-scene"]');
      if (!team || !finale) {
        return false;
      }
      return Boolean(team.compareDocumentPosition(finale) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(teamBeforeFinale).toBe(true);
  });
});
