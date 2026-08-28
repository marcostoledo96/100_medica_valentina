import { expect, test } from './narrative-test';

test.describe('Expediente scene', () => {
  test('renders the complete dossier with a stable portrait layout', async ({ page }) => {
    await page.goto('/#expediente');

    const section = page.getByRole('region', { name: 'Expediente' });
    const dossier = section.getByRole('article');
    const portrait = dossier.getByRole('img', { name: /Retrato ilustrado de/ });

    await expect(section).toBeAttached();
    await expect(dossier).toBeVisible();
    await expect(dossier.getByRole('heading', { level: 2, name: 'Expediente' })).toBeVisible();
    await expect(dossier.getByText('100%', { exact: true })).toBeVisible();
    await expect(portrait).toBeVisible();
    await expect(portrait).toHaveAttribute('src', '/images/demo/portrait.webp');
    await expect(portrait).toHaveAttribute('width', '320');
    await expect(portrait).toHaveAttribute('height', '400');

    const portraitBox = await portrait.boundingBox();
    expect(portraitBox, 'Portrait should have a rendered layout box').not.toBeNull();
    if (portraitBox) {
      expect(portraitBox.width).toBeGreaterThan(0);
      expect(portraitBox.height).toBeGreaterThan(0);
      expect(portraitBox.height / portraitBox.width).toBeCloseTo(1.25, 1);
    }
  });

  test('navigates with the real CTA and preserves keyboard focus styling', async ({ page }) => {
    await page.goto('/#expediente');

    const cta = page.getByRole('link', { name: 'Ver evolución' });
    await expect(cta).toHaveAttribute('href', '#linea-tiempo');

    const ctaBox = await cta.boundingBox();
    expect(ctaBox, 'CTA should have a rendered touch target').not.toBeNull();
    if (ctaBox) {
      expect(ctaBox.width).toBeGreaterThanOrEqual(44);
      expect(ctaBox.height).toBeGreaterThanOrEqual(44);
    }

    await cta.focus();
    await expect(cta).toBeFocused();

    const focusStyle = await cta.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        outlineStyle: styles.outlineStyle,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });
    expect(
      focusStyle.outlineStyle !== 'none' ||
        parseFloat(focusStyle.outlineWidth) > 0 ||
        focusStyle.boxShadow !== 'none'
    ).toBe(true);

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#linea-tiempo$/);
  });

  test('avoids horizontal overflow at every required viewport', async ({ page }) => {
    const viewports = [
      { width: 360, height: 740 },
      { width: 390, height: 844 },
      { width: 412, height: 915 },
      { width: 430, height: 932 },
      { width: 1280, height: 800 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/#expediente');
      await expect(page.getByRole('region', { name: 'Expediente' })).toBeAttached();

      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(
        dimensions.scrollWidth,
        `Horizontal overflow at ${viewport.width}px viewport`
      ).toBeLessThanOrEqual(dimensions.clientWidth);
    }
  });

  test('keeps the full dossier available with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#expediente');

    const dossier = page.getByRole('article', { name: 'Expediente' });
    await expect(dossier).toBeVisible();
    await expect(dossier.getByText('100%', { exact: true })).toBeVisible();
    await expect(dossier.getByText('Persona Demo', { exact: true })).toBeVisible();

    const scrollBehavior = await page
      .locator('html')
      .evaluate((element) => window.getComputedStyle(element).scrollBehavior);
    expect(scrollBehavior).toBe('auto');
  });
});
