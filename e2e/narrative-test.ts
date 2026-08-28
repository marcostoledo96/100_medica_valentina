import { expect, test as base, type ConsoleMessage } from '@playwright/test';

type NarrativeFixtures = {
  noBrowserErrors: void;
};

export const test = base.extend<NarrativeFixtures>({
  noBrowserErrors: [
    async ({ page }, use, testInfo) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      const onConsole = (message: ConsoleMessage) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      };
      const onPageError = (error: Error) => {
        pageErrors.push(error.message);
      };

      page.on('console', onConsole);
      page.on('pageerror', onPageError);

      try {
        await use();
      } finally {
        page.off('console', onConsole);
        page.off('pageerror', onPageError);

        expect(
          consoleErrors,
          `Console errors in ${testInfo.title}:\n${consoleErrors.join('\n')}`
        ).toHaveLength(0);
        expect(
          pageErrors,
          `Page errors in ${testInfo.title}:\n${pageErrors.join('\n')}`
        ).toHaveLength(0);
      }
    },
    { auto: true },
  ],
});

export { expect };
