import { test, expect } from './narrative-test';

test.describe('Narrative Shell E2E', () => {
  test('renders the shell, follows native anchors, and derives the active phase', async ({
    page,
  }) => {
    await page.goto('/');

    const main = page.locator('main#experience-root');
    const rootProvider = page.locator('[data-experience-phase]');
    const timelineLink = page.getByRole('link', { name: 'Línea de tiempo' });

    await expect(main).toBeVisible();
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'clinical');
    await expect(page.getByRole('link', { name: 'Inicio' })).toHaveAttribute(
      'aria-current',
      'location'
    );

    await timelineLink.click();

    await expect(page).toHaveURL(/#linea-tiempo$/);
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'human');
    await expect(timelineLink).toHaveAttribute('aria-current', 'location');
  });

  test('updates the active section from IntersectionObserver visibility', async ({ page }) => {
    await page.goto('/');

    const timelineSection = page.getByRole('region', { name: 'Línea de tiempo' });
    const timelineLink = page.getByRole('link', { name: 'Línea de tiempo' });
    const rootProvider = page.locator('[data-experience-phase]');

    await expect(page.getByRole('link', { name: 'Inicio' })).toHaveAttribute(
      'aria-current',
      'location'
    );
    await timelineSection.scrollIntoViewIfNeeded();

    await expect(timelineLink).toHaveAttribute('aria-current', 'location');
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'human');
  });

  test('validates no horizontal overflow across required mobile viewports (360px, 390px, 412px, 430px)', async ({
    page,
  }) => {
    const viewports = [
      { width: 360, height: 740, label: '360px (Compact Mobile)' },
      { width: 390, height: 844, label: '390px (Standard iPhone)' },
      { width: 412, height: 915, label: '412px (Standard Android)' },
      { width: 430, height: 932, label: '430px (Large Mobile)' },
      { width: 1280, height: 800, label: '1280px (Desktop)' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll, `Horizontal overflow detected on viewport ${vp.label}`).toBe(
        false
      );
    }
  });

  test('keeps every progress link at or above the 44px touch target', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const links = page
      .getByRole('navigation', { name: 'Progreso del recorrido' })
      .getByRole('link');
    await expect(links).toHaveCount(4);

    for (let index = 0; index < (await links.count()); index += 1) {
      const link = links.nth(index);
      const box = await link.boundingBox();
      expect(box, 'Bounding box must be present').not.toBeNull();
      if (box) {
        expect(box.width, `Link width ${box.width}px should be >= 44px`).toBeGreaterThanOrEqual(44);
        expect(box.height, `Link height ${box.height}px should be >= 44px`).toBeGreaterThanOrEqual(
          44
        );
      }
    }
  });

  test('activates a real anchor with keyboard focus, reverse navigation, and no positive tab indices', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const firstLink = page.getByRole('link', { name: 'Inicio' });
    const timelineLink = page.getByRole('link', { name: 'Línea de tiempo' });
    const rootProvider = page.locator('[data-experience-phase]');

    await page.keyboard.press('Tab');
    await expect(firstLink).toBeFocused();

    const focusStyle = await firstLink.evaluate((element) => {
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

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Expediente', exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(timelineLink).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Final' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(timelineLink).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/#linea-tiempo$/);
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'human');
    await expect(timelineLink).toHaveAttribute('aria-current', 'location');

    const positiveTabIndices = await page
      .locator('[tabindex]')
      .evaluateAll((elements) =>
        elements
          .map((element) => Number(element.getAttribute('tabindex')))
          .filter((tabIndex) => tabIndex > 0)
      );
    expect(positiveTabIndices).toEqual([]);
  });

  test('exposes labelled sections and active navigation without relying on color alone', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'Inicio' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Inicio' })).toBeAttached();
    await expect(page.getByRole('region', { name: 'Expediente' })).toBeAttached();
    await expect(page.getByRole('region', { name: 'Línea de tiempo' })).toBeAttached();
    await expect(page.getByRole('region', { name: 'Final' })).toBeAttached();
    await expect(page.getByRole('link', { name: 'Inicio' })).toHaveAttribute(
      'aria-current',
      'location'
    );
  });

  test('loads a direct fragment and works under prefers-reduced-motion: reduce', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#final');

    const rootProvider = page.locator('[data-experience-phase]');
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'finale');
    await expect(page.getByRole('link', { name: 'Final' })).toHaveAttribute(
      'aria-current',
      'location'
    );

    const scrollBehavior = await page
      .locator('html')
      .evaluate((element) => window.getComputedStyle(element).scrollBehavior);
    expect(scrollBehavior).toBe('auto');
  });

  test('supports browser history for revisiting sections', async ({ page }) => {
    await page.goto('/');
    const rootProvider = page.locator('[data-experience-phase]');

    await page.getByRole('link', { name: 'Línea de tiempo' }).click();
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'human');

    await page.getByRole('link', { name: 'Final' }).click();
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'finale');

    await page.goBack();
    await expect(page).toHaveURL(/#linea-tiempo$/);
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'human');

    await page.goForward();
    await expect(page).toHaveURL(/#final$/);
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'finale');
  });
});
