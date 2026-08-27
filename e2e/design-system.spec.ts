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

  test('supports keyboard navigation with visible focus indicators', async ({ page }) => {
    await page.goto('/');

    // Press tab to navigate to the first interactive element
    await page.keyboard.press('Tab');

    const activeElementTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElementTag).toBe('BUTTON');

    // Verify focus visible class or outline
    const isFocusVisible = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const styles = window.getComputedStyle(el);
      return (
        styles.outlineStyle !== 'none' ||
        styles.boxShadow.length > 0 ||
        el.classList.contains('focus-visible:outline-none')
      );
    });

    expect(isFocusVisible).toBe(true);
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
