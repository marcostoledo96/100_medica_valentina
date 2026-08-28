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

  // Issue #8: mobile widths are captured under mobile-chromium and desktop
  // widths under desktop-chromium, so each width is captured exactly once.
  const expectedProjectForWidth = (width: number) =>
    width >= 1024 ? 'desktop-chromium' : 'mobile-chromium';

  for (const vp of viewports) {
    for (const phase of phases) {
      test(`captures screenshot ${phase} @ ${vp.name}`, async ({ page }, testInfo) => {
        // Capture each width exactly once: skip whenever this project is not
        // the expected runner for this viewport width.
        if (testInfo.project.name !== expectedProjectForWidth(vp.width)) {
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

  // Issue #8: dedicated Anamnesis bridge evidence at every required width.
  const anamnesisViewports = [
    { name: '360px', width: 360, height: 740 },
    { name: '390px', width: 390, height: 844 },
    { name: '412px', width: 412, height: 915 },
    { name: '430px', width: 430, height: 932 },
    { name: '1280px', width: 1280, height: 800 },
  ];

  for (const vp of anamnesisViewports) {
    test(`captures screenshot anamnesis @ ${vp.name}`, async ({ page }, testInfo) => {
      // Same width-to-project mapping as the phase matrix above: one capture
      // per width across projects.
      if (testInfo.project.name !== expectedProjectForWidth(vp.width)) {
        test.skip();
        return;
      }

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/#anamnesis');
      await page.waitForLoadState('domcontentloaded');

      const bridge = page.getByTestId('anamnesis');
      await expect(bridge).toBeVisible();

      const filename = `anamnesis-bridge-${vp.name}.png`;
      const screenshotPath = testInfo.outputPath(filename);

      const buffer = await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

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
});
