import { test, expect } from './narrative-test';
import * as fs from 'fs';

test.describe('Visual Screenshot Capture', () => {
  const viewports = [
    { name: '360px', width: 360, height: 740 },
    { name: '390px', width: 390, height: 844 },
    { name: '430px', width: 430, height: 932 },
    { name: '1280px', width: 1280, height: 800 },
  ];

  const phases = ['clinical', 'human', 'finale'] as const;
  const sectionByPhase = {
    clinical: 'inicio',
    human: 'linea-tiempo',
    finale: 'final',
  } as const;

  for (const vp of viewports) {
    for (const phase of phases) {
      test(`captures screenshot ${phase} @ ${vp.name}`, async ({ page }, testInfo) => {
        // Execute screenshot matrix only on mobile-chromium project runner to avoid duplicate captures
        if (testInfo.project.name === 'desktop-chromium') {
          test.skip();
          return;
        }

        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`/#${sectionByPhase[phase]}`);
        await page.waitForLoadState('domcontentloaded');

        const rootProvider = page.locator('[data-experience-phase]');
        await expect(rootProvider).toHaveAttribute('data-experience-phase', phase);

        const filename = `narrative-shell-${phase}-${vp.name}.png`;
        const screenshotPath = testInfo.outputPath(filename);

        const buffer = await page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });

        // Fail if screenshot was not written or empty
        expect(buffer.byteLength, 'Screenshot buffer must not be empty').toBeGreaterThan(1000);
        expect(
          fs.existsSync(screenshotPath),
          `Screenshot file ${screenshotPath} must exist on disk`
        ).toBe(true);

        await testInfo.attach(filename, {
          body: buffer,
          contentType: 'image/png',
        });
      });
    }
  }
});
