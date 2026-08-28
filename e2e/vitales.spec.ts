import { expect, test } from './narrative-test';

const requiredViewports = [
  { width: 360, height: 900 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
  { width: 1280, height: 900 },
];

test.describe('Vital signs E2E', () => {
  test('renders the direct fragment with authored stats and accessible progress semantics', async ({
    page,
  }) => {
    await page.goto('/#signos-vitales');

    const section = page.getByRole('region', { name: 'Signos vitales' });
    const vitalSigns = page.getByTestId('vital-signs');
    const articles = vitalSigns.getByRole('article');

    await expect(page).toHaveURL(/#signos-vitales$/);
    await expect(section).toBeVisible();
    await expect(
      vitalSigns.getByRole('heading', { level: 2, name: 'Signos vitales' })
    ).toBeVisible();
    await expect(articles).toHaveCount(3);

    const numberCard = vitalSigns.getByRole('article', { name: 'Horas de Guardia Simuladas' });
    const percentageCard = vitalSigns.getByRole('article', { name: 'Nivel de Cafeína Estimado' });
    const progressCard = vitalSigns.getByRole('article', { name: 'Materias Aprobadas' });

    await expect(numberCard).toContainText('1.200 hs');
    await expect(percentageCard).toContainText('99.9%');
    await expect(percentageCard).toContainText('Dato cómico demostrativo.');
    await expect(percentageCard).toContainText('Dato en modo parodia');
    await expect(progressCard).toContainText('100 %');

    const progress = progressCard.getByRole('progressbar', { name: 'Materias Aprobadas' });
    await expect(progress).toHaveAttribute('aria-valuemin', '0');
    await expect(progress).toHaveAttribute('aria-valuemax', '100');
    await expect(progress).toHaveAttribute('aria-valuenow', '100');
  });

  test('navigates from the expediente CTA through anamnesis into vital signs', async ({ page }) => {
    await page.goto('/#expediente');

    const cta = page.getByRole('link', { name: 'Ver evolución' });
    await expect(cta).toHaveAttribute('href', '#anamnesis');

    await cta.click();

    await expect(page).toHaveURL(/#anamnesis$/);
    await expect(page.getByTestId('anamnesis')).toBeVisible();

    await page.getByRole('link', { name: 'Continuar la historia' }).click();

    await expect(page).toHaveURL(/#signos-vitales$/);
    await expect(page.getByRole('region', { name: 'Signos vitales' })).toBeVisible();
    await expect(page.getByTestId('vital-signs')).toBeVisible();
  });

  test('avoids horizontal overflow at every required viewport', async ({ page }) => {
    for (const viewport of requiredViewports) {
      await page.setViewportSize(viewport);
      await page.goto('/#signos-vitales');
      await expect(page.getByTestId('vital-signs')).toBeVisible();

      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(
        dimensions.scrollWidth,
        `Horizontal overflow at ${viewport.width}x${viewport.height}`
      ).toBeLessThanOrEqual(dimensions.clientWidth);
    }
  });

  test('renders final values immediately with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#signos-vitales');

    const vitalSigns = page.getByTestId('vital-signs');
    await expect(
      vitalSigns.getByRole('heading', { level: 2, name: 'Signos vitales' })
    ).toBeVisible();
    await expect(
      vitalSigns.getByRole('article', { name: 'Horas de Guardia Simuladas' })
    ).toContainText('1.200 hs');
    await expect(
      vitalSigns.getByRole('article', { name: 'Nivel de Cafeína Estimado' })
    ).toContainText('99.9%');
    await expect(vitalSigns.getByRole('article', { name: 'Materias Aprobadas' })).toContainText(
      '100 %'
    );
  });
});
