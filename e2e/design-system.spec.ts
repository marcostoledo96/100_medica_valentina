import { test, expect } from '@playwright/test';

test.describe('Design System Showcase E2E', () => {
  test('renders showcase with zero console errors and allows phase switching', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await page.goto('/');

    const main = page.locator('main#experience-root');
    await expect(main).toBeVisible();

    const rootProvider = page.locator('[data-experience-phase]');
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'clinical');

    // Switch to Human phase
    const humanButton = page.getByRole('button', { name: 'human', exact: true });
    await humanButton.click();
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'human');

    // Switch to Finale phase
    const finaleButton = page.getByRole('button', { name: 'finale', exact: true });
    await finaleButton.click();
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'finale');

    // Switch back to Clinical phase
    const clinicalButton = page.getByRole('button', { name: 'clinical', exact: true });
    await clinicalButton.click();
    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'clinical');

    expect(consoleErrors).toHaveLength(0);
    expect(pageErrors).toHaveLength(0);
  });

  test('validates no horizontal overflow across required mobile viewports (360px, 390px, 412px, 430px)', async ({
    page,
  }) => {
    const viewports = [
      { width: 360, height: 740, label: '360px (Compact Mobile)' },
      { width: 390, height: 844, label: '390px (Standard iPhone)' },
      { width: 412, height: 915, label: '412px (Standard Android)' },
      { width: 430, height: 932, label: '430px (Large Mobile)' },
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

  test('enforces minimum 44x44px touch targets on interactive buttons', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const primaryBtn = page.getByTestId('showcase-btn-primary');
    const secondaryBtn = page.getByTestId('showcase-btn-secondary');
    const iconBtnCheck = page.getByTestId('showcase-icon-btn-check');
    const iconBtnHeart = page.getByTestId('showcase-icon-btn-heart');

    const buttons = [primaryBtn, secondaryBtn, iconBtnCheck, iconBtnHeart];

    for (const btn of buttons) {
      const box = await btn.boundingBox();
      expect(box, 'Bounding box must be present').not.toBeNull();
      if (box) {
        expect(box.width, `Button width ${box.width}px should be >= 44px`).toBeGreaterThanOrEqual(
          44
        );
        expect(
          box.height,
          `Button height ${box.height}px should be >= 44px`
        ).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('supports keyboard navigation with visible focus indicators on Button and IconButton', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Capture resting button shadow before focus
    const primaryBtn = page.getByTestId('showcase-btn-primary');
    const restingBoxShadow = await primaryBtn.evaluate(
      (el) => window.getComputedStyle(el).boxShadow
    );

    // Tab through interactive elements until we reach primary button
    let activeId = '';
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      activeId = await page.evaluate(
        () =>
          document.activeElement?.getAttribute('data-testid') ||
          document.activeElement?.textContent?.trim() ||
          ''
      );
      if (activeId === 'showcase-btn-primary') break;
    }
    expect(activeId).toBe('showcase-btn-primary');

    // Verify computed focus indicator on focused Button (poll to accommodate 150ms CSS box-shadow transition)
    await expect
      .poll(async () => {
        return primaryBtn.evaluate((el, resting) => {
          const css = window.getComputedStyle(el);
          const hasVisibleOutline =
            css.outlineStyle !== 'none' &&
            parseFloat(css.outlineWidth) > 0 &&
            css.outlineColor !== 'rgba(0, 0, 0, 0)' &&
            css.outlineColor !== 'transparent';

          const hasVisibleRing =
            css.boxShadow !== resting &&
            css.boxShadow !== 'none' &&
            css.boxShadow.length > resting.length;

          return hasVisibleOutline || hasVisibleRing;
        }, restingBoxShadow);
      })
      .toBe(true);

    // Continue tabbing to icon button
    const iconBtnCheck = page.getByTestId('showcase-icon-btn-check');
    const restingIconShadow = await iconBtnCheck.evaluate(
      (el) => window.getComputedStyle(el).boxShadow
    );

    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      activeId = await page.evaluate(
        () => document.activeElement?.getAttribute('data-testid') || ''
      );
      if (activeId === 'showcase-icon-btn-check') break;
    }
    expect(activeId).toBe('showcase-icon-btn-check');

    // Verify computed focus indicator on focused IconButton (poll to accommodate CSS transition)
    await expect
      .poll(async () => {
        return iconBtnCheck.evaluate((el, resting) => {
          const css = window.getComputedStyle(el);
          const hasVisibleOutline =
            css.outlineStyle !== 'none' &&
            parseFloat(css.outlineWidth) > 0 &&
            css.outlineColor !== 'rgba(0, 0, 0, 0)' &&
            css.outlineColor !== 'transparent';

          const hasVisibleRing =
            css.boxShadow !== resting &&
            css.boxShadow !== 'none' &&
            css.boxShadow.length > resting.length;

          return hasVisibleOutline || hasVisibleRing;
        }, restingIconShadow);
      })
      .toBe(true);
  });

  test('renders VisuallyHidden content with accessible sr-only class', async ({ page }) => {
    await page.goto('/');

    const srContent = page.getByText(
      'Screen-reader audit verified: VisuallyHidden text correctly parsed.'
    );
    await expect(srContent).toBeAttached();
    await expect(srContent).toHaveClass(/sr-only/);
  });

  test('functions seamlessly under prefers-reduced-motion: reduce', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const primaryBtn = page.getByTestId('showcase-btn-primary');
    await expect(primaryBtn).toBeVisible();
    await primaryBtn.click();

    // Verify button was clicked without animation hang
    const clickCounter = page.getByText('Click counter:');
    await expect(clickCounter).toContainText('1');
  });
});
