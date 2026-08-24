import { test, expect } from '@playwright/test';

test.describe('App Smoke Test', () => {
  test('loads successfully and displays experience root without demo content', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    const main = page.locator('main#experience-root');
    await expect(main).toBeAttached();
    await expect(main).toBeVisible();

    // Verify no default Vite demo text is present
    await expect(page.locator('text=Vite + React')).toHaveCount(0);
    await expect(page.locator('text=count is')).toHaveCount(0);

    expect(consoleErrors).toEqual([]);
  });
});
