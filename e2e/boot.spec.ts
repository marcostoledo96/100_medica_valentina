import { test, expect } from './narrative-test';
import type { Page } from '@playwright/test';
import { BOOT_INTRO_SEEN_STORAGE_KEY } from '../src/features/boot/bootPersistence';

async function openFirstVisit(page: Page) {
  await page.goto('/');
  await page.evaluate((key: string) => {
    window.localStorage.removeItem(key);
  }, BOOT_INTRO_SEEN_STORAGE_KEY);
  await page.goto('/#inicio');
}

test.describe('Boot Experience E2E', () => {
  test('shows the first-visit boot, an immediate CTA, and a visible skip action', async ({
    page,
  }) => {
    await openFirstVisit(page);

    const boot = page.locator('[data-boot-scene="true"]');
    await expect(boot).toHaveAttribute('data-boot-state', 'intro');
    await expect(page.getByRole('heading', { level: 1, name: 'Inicio' })).toBeVisible();
    await expect(boot.getByRole('link', { name: 'Abrir expediente' })).toBeVisible();
    await expect(boot.getByRole('link', { name: 'Saltar intro' })).toBeVisible();
    await expect(boot.locator('[data-boot-stage]')).toHaveCount(3);
    await expect(page.locator('audio')).toHaveCount(0);
  });

  test('opens the expediente through the configured real anchor and remembers opening it', async ({
    page,
  }) => {
    await openFirstVisit(page);

    const openLink = page.getByRole('link', { name: 'Abrir expediente' });
    await expect(openLink).toHaveAttribute('href', '#expediente');
    await openLink.click();
    await expect(page).toHaveURL(/#expediente$/);

    await page.goto('/#inicio');
    await expect(page.locator('[data-boot-scene="true"]')).toHaveAttribute(
      'data-boot-state',
      'revisit'
    );
  });

  test('skips and persists the revisit state, then replays without deleting the key', async ({
    page,
  }) => {
    await openFirstVisit(page);

    await page.getByRole('link', { name: 'Saltar intro' }).click();
    await expect(page).toHaveURL(/#expediente$/);

    await page.goto('/#inicio');
    const boot = page.locator('[data-boot-scene="true"]');
    await expect(boot).toHaveAttribute('data-boot-state', 'revisit');
    await expect(
      page.getByText('Este acceso ya fue revisado. El expediente está disponible.')
    ).toBeVisible();

    const replay = page.getByRole('button', { name: 'Reproducir introducción' });
    await replay.click();
    await expect(boot).toHaveAttribute('data-boot-state', 'intro');
    await expect(page.getByRole('link', { name: 'Saltar intro' })).toBeVisible();

    const storedValue = await page.evaluate(
      (key: string) => window.localStorage.getItem(key),
      BOOT_INTRO_SEEN_STORAGE_KEY
    );
    expect(storedValue).toBe('true');
  });

  test('keeps the 360px scene within the viewport and preserves touch targets', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await openFirstVisit(page);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalOverflow).toBe(false);

    for (const action of [
      page.getByRole('link', { name: 'Abrir expediente' }),
      page.getByRole('link', { name: 'Saltar intro' }),
    ]) {
      const box = await action.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('supports keyboard focus and activation without positive tab indices', async ({ page }) => {
    await openFirstVisit(page);

    const skip = page.getByRole('link', { name: 'Saltar intro' });
    await skip.focus();
    await expect(skip).toBeFocused();

    const focusStyle = await skip.evaluate((element) => {
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
    await expect(page).toHaveURL(/#expediente$/);

    const positiveTabIndices = await page
      .locator('[tabindex]')
      .evaluateAll((elements) =>
        elements
          .map((element) => Number(element.getAttribute('tabindex')))
          .filter((tabIndex) => tabIndex > 0)
      );
    expect(positiveTabIndices).toEqual([]);
  });

  test('keeps content and actions immediately available with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openFirstVisit(page);

    const boot = page.locator('[data-boot-scene="true"]');
    await expect(boot.getByRole('link', { name: 'Abrir expediente' })).toBeVisible();
    await expect(boot.getByRole('link', { name: 'Saltar intro' })).toBeVisible();
    await expect(boot.locator('[data-boot-stage="ready"]')).toBeVisible();

    const animationNames = await boot
      .locator('.boot-scan__row')
      .evaluateAll((elements) =>
        elements.map((element) => window.getComputedStyle(element).animationName)
      );
    expect(animationNames.every((animationName) => animationName === 'none')).toBe(true);
  });
});
