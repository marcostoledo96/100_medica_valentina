import { test, expect } from '@playwright/test';

test.describe('App Smoke Test', () => {
  test('loads successfully and displays experience root without demo content', async ({
    page,
    baseURL,
  }) => {
    if (!baseURL) {
      throw new Error('Playwright baseURL is required for same-origin smoke checks');
    }

    const appOrigin = new URL(baseURL).origin;
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedRequests: string[] = [];
    const httpErrors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        const location = message.location();
        const source = location.url
          ? ` (${location.url}:${location.lineNumber}:${location.columnNumber})`
          : '';
        consoleErrors.push(`${message.text()}${source}`);
      }
    });

    page.on('pageerror', (error) => {
      pageErrors.push(error.stack ?? error.message);
    });

    page.on('requestfailed', (request) => {
      if (new URL(request.url()).origin === appOrigin) {
        failedRequests.push(
          `${request.url()} — ${request.failure()?.errorText ?? 'unknown failure'}`
        );
      }
    });

    page.on('response', (response) => {
      if (new URL(response.url()).origin === appOrigin && response.status() >= 400) {
        httpErrors.push(`${response.url()} — HTTP ${response.status()}`);
      }
    });

    const navigationResponse = await page.goto('/');

    if (!navigationResponse) {
      throw new Error(`Navigation to ${new URL('/', baseURL).href} returned no response`);
    }

    expect(
      navigationResponse.ok(),
      `Initial navigation failed: ${navigationResponse.url()} — HTTP ${navigationResponse.status()}`
    ).toBe(true);

    const main = page.locator('main#experience-root');
    await expect(main).toBeAttached();
    await expect(main).toBeVisible();

    await expect(page.getByText('Vite + React', { exact: true })).toHaveCount(0);
    await expect(page.getByText(/count is/i)).toHaveCount(0);

    const localResourceUrls = await page.locator('link[href], script[src]').evaluateAll(
      (elements, origin) =>
        elements
          .map((element) => {
            const attribute = element instanceof HTMLLinkElement ? 'href' : 'src';
            const value = element.getAttribute(attribute);
            return value ? new URL(value, document.baseURI) : null;
          })
          .filter((url): url is URL => url !== null && url.origin === origin)
          .map((url) => url.href),
      appOrigin
    );

    const brokenLocalResources: string[] = [];
    await Promise.all(
      [...new Set(localResourceUrls)].map(async (url) => {
        const response = await page.request.get(url, { failOnStatusCode: false });
        if (!response.ok()) {
          brokenLocalResources.push(`${url} — HTTP ${response.status()}`);
        }
        await response.dispose();
      })
    );

    expect(
      brokenLocalResources,
      `Broken local resources:\n${brokenLocalResources.join('\n')}`
    ).toHaveLength(0);
    expect(consoleErrors, `Console errors:\n${consoleErrors.join('\n')}`).toHaveLength(0);
    expect(pageErrors, `Uncaught page errors:\n${pageErrors.join('\n')}`).toHaveLength(0);
    expect(failedRequests, `Failed requests:\n${failedRequests.join('\n')}`).toHaveLength(0);
    expect(httpErrors, `Same-origin HTTP errors:\n${httpErrors.join('\n')}`).toHaveLength(0);
  });
});
