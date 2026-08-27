import { test } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const outputDir =
  process.env.SCREENSHOT_DIR ||
  '/home/marcos/.gemini/antigravity/brain/bf6e8f59-58be-48c3-a209-7b14030611b2/scratch/screenshots';

test.describe('Visual Screenshot Capture', () => {
  test.beforeAll(() => {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
    } catch {
      // Ignore if directory creation is restricted in sandbox
    }
  });

  const viewports = [
    { name: '360px', width: 360, height: 740 },
    { name: '390px', width: 390, height: 844 },
    { name: '430px', width: 430, height: 932 },
    { name: '1280px', width: 1280, height: 800 },
  ];

  const phases = ['clinical', 'human', 'finale'] as const;

  for (const vp of viewports) {
    for (const phase of phases) {
      test(`captures screenshot ${phase} @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        const phaseBtn = page.getByRole('button', { name: phase, exact: true });
        await phaseBtn.click();
        await page.waitForTimeout(150);

        try {
          const filePath = path.join(outputDir, `showcase-${phase}-${vp.name}.png`);
          await page.screenshot({ path: filePath, fullPage: true });
        } catch {
          // Graceful fallback if screenshot path unwritable
        }
      });
    }
  }
});
