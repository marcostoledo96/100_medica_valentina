import { test, expect } from './narrative-test';
import type { Page } from '@playwright/test';

const viewports = [
  { width: 360, height: 740, label: '360px' },
  { width: 390, height: 844, label: '390px' },
  { width: 412, height: 915, label: '412px' },
  { width: 430, height: 932, label: '430px' },
  { width: 1280, height: 800, label: '1280px' },
];

async function openGallery(page: Page): Promise<void> {
  await page.goto('/');
  const gallery = page.getByTestId('gallery');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toBeVisible();
}

test.describe('Gallery feature E2E', () => {
  test('keeps the page contained while showing one primary card and a partial next card', async ({
    page,
  }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await openGallery(page);
      const carousel = page.getByTestId('gallery-carousel');
      const firstTrigger = page.getByTestId('gallery-trigger-demo-gallery-01');
      const slides = carousel.locator('[data-gallery-slide]');

      await expect(firstTrigger).toBeVisible();
      await expect(
        page.getByRole('heading', { level: 3, name: 'Estudio Complementario Demo 1' })
      ).toBeVisible();
      await expect(slides).toHaveCount(2);

      const metrics = await carousel.evaluate((element) => {
        const viewportRect = element.getBoundingClientRect();
        const slideRects = Array.from(
          element.querySelectorAll<HTMLElement>('[data-gallery-slide]')
        ).map((slide) => slide.getBoundingClientRect());

        return {
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          firstWidth: slideRects[0]?.width ?? 0,
          secondVisible: Boolean(
            slideRects[1] &&
            slideRects[1].left < viewportRect.right &&
            slideRects[1].right > viewportRect.left
          ),
          touchAction: window.getComputedStyle(element).touchAction,
          snapType: window.getComputedStyle(element).scrollSnapType,
        };
      });

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
        ),
        `Horizontal page overflow at ${viewport.label}`
      ).toBe(true);
      expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
      expect(metrics.firstWidth).toBeGreaterThan(metrics.clientWidth * 0.6);
      expect(metrics.secondVisible).toBe(true);
      expect(metrics.touchAction).toContain('pan-x');
      expect(metrics.touchAction).toContain('pan-y');
      expect(metrics.snapType).toContain('x');

      await carousel.hover();
      await page.mouse.wheel(metrics.clientWidth, 0);
      await expect
        .poll(() => carousel.evaluate((element) => element.scrollLeft))
        .toBeGreaterThan(0);
      await expect(page.getByTestId('gallery-trigger-demo-gallery-02')).toBeVisible();
    }
  });

  test('opens the primary item with keyboard-safe lightbox controls and restores focus', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openGallery(page);

    const firstTrigger = page.getByTestId('gallery-trigger-demo-gallery-01');
    await firstTrigger.click();

    const dialog = page.getByRole('dialog');
    const closeButton = page.getByRole('button', { name: 'Cerrar galería' });
    const previousButton = page.getByRole('button', { name: 'Imagen anterior' });
    const nextButton = page.getByRole('button', { name: 'Imagen siguiente' });

    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-labelledby', 'gallery-dialog-title-demo-gallery-01');
    await expect(dialog).toHaveAttribute('data-gallery-current-id', 'demo-gallery-01');
    await expect(closeButton).toBeFocused();
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

    for (const control of [closeButton, previousButton, nextButton]) {
      const box = await control.boundingBox();
      expect(box, 'Lightbox control must have a bounding box').not.toBeNull();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }

    await page.keyboard.press('Tab');
    await expect(nextButton).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(closeButton).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(nextButton).toBeFocused();
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);

    await page.keyboard.press('ArrowRight');
    await expect(dialog).toHaveAttribute('data-gallery-current-id', 'demo-gallery-02');
    await expect(
      dialog.getByRole('heading', { level: 2, name: 'Estudio Complementario Demo 2' })
    ).toBeVisible();
    await page.keyboard.press('ArrowLeft');
    await expect(dialog).toHaveAttribute('data-gallery-current-id', 'demo-gallery-01');

    const positiveTabIndices = await page
      .locator('[tabindex]')
      .evaluateAll((elements) =>
        elements
          .map((element) => Number(element.getAttribute('tabindex')))
          .filter((tabIndex) => tabIndex > 0)
      );
    expect(positiveTabIndices).toEqual([]);

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(firstTrigger).toBeFocused();
    await expect(page.locator('body')).toHaveCSS('overflow', 'visible');
  });

  test('preserves vertical page scroll and remains usable with reduced motion', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await openGallery(page);

    const carousel = page.getByTestId('gallery-carousel');
    const carouselBox = await carousel.boundingBox();
    expect(carouselBox).not.toBeNull();
    if (carouselBox) {
      await page.mouse.move(
        carouselBox.x + carouselBox.width / 2,
        carouselBox.y + carouselBox.height / 2
      );
    }

    const beforeScroll = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 260);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(beforeScroll);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    const reducedCarousel = page.getByTestId('gallery-carousel');
    await reducedCarousel.scrollIntoViewIfNeeded();
    await expect(reducedCarousel).toBeVisible();

    const reducedCard = reducedCarousel.locator('[data-gallery-slide]').first().locator('article');
    const reducedImage = reducedCarousel.getByRole('img').first();
    const reducedMotionStyles = await reducedCarousel.evaluate((element) => ({
      scrollBehavior: window.getComputedStyle(element).scrollBehavior,
    }));
    expect(reducedMotionStyles.scrollBehavior).toBe('auto');
    const reducedTransitionDurations = await Promise.all(
      [reducedCard, reducedImage].map((element) =>
        element.evaluate((node) => parseFloat(window.getComputedStyle(node).transitionDuration))
      )
    );
    expect(reducedTransitionDurations.every((duration) => duration < 0.001)).toBe(true);
    await expect(reducedCard).toHaveCSS('transform', 'none');
  });
});
