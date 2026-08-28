import { test, expect } from './narrative-test';

test.describe('Anamnesis E2E', () => {
  test('renders the provisional narrative bridge at the native fragment', async ({ page }) => {
    await page.goto('/#anamnesis');

    const section = page.getByRole('region', { name: 'Anamnesis' });
    const bridge = page.getByTestId('anamnesis');

    await expect(page).toHaveURL(/#anamnesis$/);
    await expect(section).toBeVisible();
    await expect(bridge).toBeVisible();
    await expect(bridge.getByRole('heading', { level: 2, name: 'Anamnesis' })).toBeVisible();
    await expect(bridge.getByText('Origen', { exact: true })).toBeVisible();
    await expect(bridge.getByText('Vocación', { exact: true })).toBeVisible();
    await expect(bridge.getByRole('heading', { level: 3 })).toHaveCount(2);
    await expect(bridge.getByText(/puente narrativo provisional/i)).toBeVisible();
  });

  test('renders the fixture photo with contextual provisional alt, or its fallback', async ({
    page,
  }) => {
    await page.goto('/#anamnesis');

    const bridge = page.getByTestId('anamnesis');
    const photo = bridge.getByTestId('anamnesis-photo');
    const fallback = bridge.getByTestId('anamnesis-photo-fallback');

    await expect(photo.or(fallback)).toBeVisible();

    if (await photo.isVisible()) {
      const img = photo.getByRole('img');
      await expect(img).toHaveAttribute('src', '/images/demo/portrait.webp');
      await expect(img).toHaveAttribute('loading', 'lazy');
      const alt = await img.getAttribute('alt');
      expect(alt?.toLowerCase(), 'Alt must describe the provisional demo photo').toContain(
        'provisional'
      );
    } else {
      await expect(fallback).toContainText('no disponible');
    }
  });

  test('renders the semantic provisional quote with attribution', async ({ page }) => {
    await page.goto('/#anamnesis');

    // Valid DOM: figure[data-testid=anamnesis-quote] containing a blockquote and
    // a sibling figcaption that wraps the cite attribution.
    const figure = page.getByTestId('anamnesis').getByTestId('anamnesis-quote');
    await expect(figure).toBeVisible();

    const quote = figure.getByRole('blockquote');
    const attribution = figure.locator('figcaption');
    const cite = attribution.locator('cite');

    await expect(quote).toBeVisible();
    await expect(quote).toContainText(/provisional/i);

    await expect(attribution).toBeVisible();
    await expect(cite).toBeVisible();
    await expect(cite).toContainText(/provisional/i);

    // Structural guard: cite must stay beside the blockquote, never inside it.
    await expect(quote.locator('cite')).toHaveCount(0);
  });

  test('marks the intentional transition toward the chronological timeline', async ({ page }) => {
    await page.goto('/#anamnesis');

    const transitionBridge = page.getByTestId('anamnesis-bridge');
    await expect(transitionBridge).toBeVisible();

    const rule = transitionBridge.locator('.anamnesis__bridge-rule');
    await expect(rule).toBeVisible();
    const backgroundImage = await rule.evaluate(
      (element) => window.getComputedStyle(element).backgroundImage
    );
    expect(backgroundImage).toContain('gradient');

    await expect(
      transitionBridge.getByRole('link', { name: 'Continuar la historia' })
    ).toHaveAttribute('href', '#signos-vitales');
  });

  test('keeps route order: expediente CTA leads into anamnesis and out to signos vitales', async ({
    page,
  }) => {
    await page.goto('/#expediente');

    await page.getByRole('link', { name: 'Ver evolución' }).click();
    await expect(page).toHaveURL(/#anamnesis$/);
    await expect(page.getByTestId('anamnesis')).toBeVisible();

    await page.getByRole('link', { name: 'Continuar la historia' }).click();
    await expect(page).toHaveURL(/#signos-vitales$/);
    await expect(page.getByRole('region', { name: 'Signos vitales' })).toBeAttached();
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
      await page.goto('/#anamnesis');
      await expect(page.getByTestId('anamnesis')).toBeVisible();

      // NarrativeShell clips horizontal overflow at #experience-root
      // (overflow-x-clip), so a document scrollWidth check alone cannot prove
      // descendants stay visible. Assert instead that the Anamnesis section and
      // every descendant keep their bounding boxes inside the document client
      // area. Polling absorbs entrance animation transients; genuine clipping
      // never settles. 1px tolerance covers subpixel rounding of rotated boxes
      // (.anamnesis__photo).
      await expect
        .poll(
          () =>
            page.evaluate(() => {
              const tolerancePx = 1;
              const clientWidth = document.documentElement.clientWidth;
              const root = document.querySelector('[data-narrative-section="anamnesis"]');
              if (!root) return ['anamnesis section not found'];
              const offenders: string[] = [];
              for (const element of [root, ...Array.from(root.querySelectorAll('*'))]) {
                const rect = element.getBoundingClientRect();
                if (rect.width === 0 && rect.height === 0) continue;
                if (rect.left < -tolerancePx || rect.right > clientWidth + tolerancePx) {
                  const className = element.getAttribute('class') ?? '';
                  offenders.push(
                    `${element.tagName.toLowerCase()}.${className} left=${rect.left.toFixed(1)} right=${rect.right.toFixed(1)}`
                  );
                }
              }
              return offenders;
            }),
          {
            message: `Anamnesis content must not be clipped or overflow horizontally at ${viewport.width}px viewport`,
          }
        )
        .toEqual([]);

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

  test('keeps the full bridge readable with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#anamnesis');

    const bridge = page.getByTestId('anamnesis');
    await expect(bridge).toBeVisible();
    await expect(bridge.getByRole('heading', { level: 2, name: 'Anamnesis' })).toBeVisible();

    for (const blockTitle of await bridge.getByRole('heading', { level: 3 }).all()) {
      await expect(blockTitle).toBeVisible();
    }
    await expect(bridge.getByRole('blockquote')).toBeVisible();
    await expect(bridge.getByTestId('anamnesis-bridge')).toBeVisible();

    const scrollBehavior = await page
      .locator('html')
      .evaluate((element) => window.getComputedStyle(element).scrollBehavior);
    expect(scrollBehavior).toBe('auto');
  });

  test('activates the real CTA with keyboard focus styling', async ({ page }) => {
    await page.goto('/#anamnesis');

    const cta = page.getByRole('link', { name: 'Continuar la historia' });
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
    await expect(page).toHaveURL(/#signos-vitales$/);
  });
});
