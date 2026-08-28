import type { Page } from '@playwright/test';
import { expect, test } from './narrative-test';

const viewports = [
  { width: 360, height: 740, label: '360px' },
  { width: 390, height: 844, label: '390px' },
  { width: 430, height: 932, label: '430px' },
  { width: 1280, height: 800, label: '1280px' },
];

type PlaybackMockMode = 'resolve' | 'reject';

/**
 * Replaces native media playback with an event-driven mock so tests exercise
 * the real component state machine without physical audio output, sleeps, or
 * real durations. No native playback is started, so no /audio request is ever
 * fetched by the mock itself.
 */
async function installPlaybackMock(page: Page, mode: PlaybackMockMode = 'resolve') {
  await page.addInitScript((playbackMode: PlaybackMockMode) => {
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      if (playbackMode === 'reject') {
        return Promise.reject(
          new DOMException('Playback blocked by media policy', 'NotAllowedError')
        );
      }

      this.dispatchEvent(new Event('play'));
      return Promise.resolve();
    };
    HTMLMediaElement.prototype.pause = function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event('pause'));
    };
  }, mode);
}

async function openAudioMessages(page: Page) {
  await page.goto('/');
  const audioMessages = page.getByTestId('audio-messages');
  await audioMessages.scrollIntoViewIfNeeded();
  await expect(audioMessages).toBeVisible();
  return audioMessages;
}

test.describe('Audio messages feature E2E', () => {
  test('keeps authored messages and controls usable across target viewports', async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const audioMessages = await openAudioMessages(page);
      const firstCard = audioMessages.getByTestId('audio-message-demo-audio-01');
      const firstButton = audioMessages
        .getByRole('button', { name: /Reproducir mensaje:/ })
        .first();

      await expect(
        audioMessages.getByRole('heading', { level: 2, name: 'Voces que acompañan' })
      ).toBeVisible();
      await expect(firstCard).toContainText('Amigo de la Carrera Demo');
      await expect(firstCard).toContainText('Duración: 0:25');
      await expect(audioMessages.getByRole('button', { name: /Reproducir mensaje:/ })).toHaveCount(
        2
      );
      await expect(page.locator('audio')).toHaveCount(0);

      const dimensions = await audioMessages.evaluate((element) => {
        const buttons = Array.from(
          element.querySelectorAll<HTMLButtonElement>('[data-audio-control]')
        );
        const rect = element.getBoundingClientRect();

        return {
          right: rect.right,
          buttons: buttons.map((button) => {
            const buttonRect = button.getBoundingClientRect();
            return { width: buttonRect.width, height: buttonRect.height };
          }),
          pageFitsViewport:
            document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        };
      });

      expect(dimensions.right).toBeLessThanOrEqual(viewport.width + 1);
      expect(dimensions.pageFitsViewport, `Horizontal overflow at ${viewport.label}`).toBe(true);
      expect(
        dimensions.buttons.every(({ width, height }) => width >= 44 && height >= 44),
        `Audio controls must keep a 44px touch target at ${viewport.label}`
      ).toBe(true);
      await expect(firstButton).toBeEnabled();
    }
  });

  test('creates media only after a mocked user action and keeps zero pre-play nodes', async ({
    page,
  }) => {
    await installPlaybackMock(page);
    await page.setViewportSize({ width: 390, height: 844 });

    const audioMessages = await openAudioMessages(page);
    const firstCard = audioMessages.getByTestId('audio-message-demo-audio-01');
    const firstButton = audioMessages.getByTestId('audio-control-demo-audio-01');
    const firstMedia = audioMessages.getByTestId('audio-media-demo-audio-01');

    await expect(page.locator('audio')).toHaveCount(0);
    await expect(firstCard).toHaveAttribute('data-audio-state', 'idle');
    await expect(firstButton).toHaveAttribute('aria-pressed', 'false');

    await firstButton.click();

    await expect(firstMedia).toHaveAttribute('src', '/audio/demo/audio-01.mp3');
    await expect(firstCard).toHaveAttribute('data-audio-state', 'playing');
    await expect(firstButton).toHaveAttribute('aria-pressed', 'true');
    await expect(firstButton).toHaveAccessibleName(/Pausar mensaje:/);

    await firstButton.click();

    await expect(firstCard).toHaveAttribute('data-audio-state', 'paused');
    await expect(firstButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('arbitrates playback: playing B pauses A while both media stay resumable', async ({
    page,
  }) => {
    await installPlaybackMock(page);

    const audioMessages = await openAudioMessages(page);
    const firstCard = audioMessages.getByTestId('audio-message-demo-audio-01');
    const secondCard = audioMessages.getByTestId('audio-message-demo-audio-02');
    const firstButton = audioMessages.getByTestId('audio-control-demo-audio-01');
    const secondButton = audioMessages.getByTestId('audio-control-demo-audio-02');

    await firstButton.click();
    await expect(firstCard).toHaveAttribute('data-audio-state', 'playing');
    await expect(secondCard).toHaveAttribute('data-audio-state', 'idle');
    await expect(audioMessages.getByTestId('audio-media-demo-audio-01')).toHaveAttribute(
      'src',
      '/audio/demo/audio-01.mp3'
    );

    await secondButton.click();

    await expect(secondCard).toHaveAttribute('data-audio-state', 'playing');
    await expect(firstCard).toHaveAttribute('data-audio-state', 'paused');
    await expect(firstButton).toHaveAttribute('aria-pressed', 'false');
    await expect(secondButton).toHaveAttribute('aria-pressed', 'true');
    await expect(audioMessages.getByTestId('audio-media-demo-audio-02')).toHaveAttribute(
      'src',
      '/audio/demo/audio-02.m4a'
    );
    await expect(page.locator('audio')).toHaveCount(2);

    await firstButton.click();
    await expect(firstCard).toHaveAttribute('data-audio-state', 'playing');
    await expect(secondCard).toHaveAttribute('data-audio-state', 'paused');
  });

  test('supports keyboard activation with retained focus across state changes', async ({
    page,
  }) => {
    await installPlaybackMock(page);

    const audioMessages = await openAudioMessages(page);
    const firstCard = audioMessages.getByTestId('audio-message-demo-audio-01');
    const firstButton = audioMessages.getByTestId('audio-control-demo-audio-01');

    await firstButton.focus();
    await expect(firstButton).toBeFocused();

    await page.keyboard.press('Enter');

    await expect(firstCard).toHaveAttribute('data-audio-state', 'playing');
    await expect(firstButton).toBeFocused();
    await expect(firstButton).toHaveAccessibleName(/Pausar mensaje:/);

    await page.keyboard.press('Space');

    await expect(firstCard).toHaveAttribute('data-audio-state', 'paused');
    await expect(firstButton).toBeFocused();
    await expect(firstButton).toHaveAccessibleName(/Reproducir mensaje:/);
  });

  test('keeps /audio requests and media elements at zero until the play action', async ({
    page,
  }) => {
    await installPlaybackMock(page);

    const audioRequests: string[] = [];
    await page.route(/^https?:\/\/[^/]+\/audio\//, (route) => {
      audioRequests.push(route.request().url());
      void route.fulfill({ status: 200, contentType: 'audio/mpeg', body: '' });
    });

    const audioMessages = await openAudioMessages(page);

    await expect(page.locator('audio')).toHaveCount(0);
    await expect(audioMessages.getByTestId('audio-message-demo-audio-01')).toHaveAttribute(
      'data-audio-state',
      'idle'
    );
    expect(audioRequests, 'no /audio request before an explicit play action').toHaveLength(0);

    await audioMessages.getByTestId('audio-control-demo-audio-01').click();

    await expect(audioMessages.getByTestId('audio-message-demo-audio-01')).toHaveAttribute(
      'data-audio-state',
      'playing'
    );
    // The playback mock never starts native playback, so the network fetch is
    // owned by the real play() call in production; the contract proven here is
    // that nothing requests /audio before the explicit user action.
    expect(audioRequests).toHaveLength(0);
  });

  test('shows a recoverable failure state and keeps the surrounding app usable', async ({
    page,
  }) => {
    await installPlaybackMock(page, 'reject');

    const audioMessages = await openAudioMessages(page);
    const firstCard = audioMessages.getByTestId('audio-message-demo-audio-01');
    const firstButton = audioMessages.getByTestId('audio-control-demo-audio-01');

    await firstButton.click();

    await expect(firstCard).toHaveAttribute('data-audio-state', 'error');
    await expect(firstCard.getByRole('alert')).toHaveText(
      'Este mensaje no está disponible en este momento.'
    );
    await expect(firstButton).toHaveAccessibleName(/Reintentar mensaje:/);
    await expect(firstButton).toBeEnabled();

    await page.locator('[data-section-link="inicio"]').click();
    await expect(page.getByRole('heading', { level: 1, name: 'Inicio' })).toBeVisible();
    await expect(page.locator('[data-section-link="inicio"]')).toHaveAttribute(
      'aria-current',
      'location'
    );

    await page.locator('[data-section-link="galeria"]').click();
    await audioMessages.scrollIntoViewIfNeeded();
    await expect(firstCard).toHaveAttribute('data-audio-state', 'error');
    await expect(firstButton).toBeEnabled();

    await firstButton.click();
    await expect(firstCard).toHaveAttribute('data-audio-state', 'error');

    await page.locator('[data-section-link="expediente"]').click();
    await expect(page.getByRole('heading', { level: 2, name: 'Expediente' })).toBeVisible();
    await expect(page.locator('[data-section-link="expediente"]')).toHaveAttribute(
      'aria-current',
      'location'
    );
  });

  test('transitions to idle on ended and replays the same message', async ({ page }) => {
    await installPlaybackMock(page);

    const audioMessages = await openAudioMessages(page);
    const firstCard = audioMessages.getByTestId('audio-message-demo-audio-01');
    const firstButton = audioMessages.getByTestId('audio-control-demo-audio-01');
    const firstMedia = audioMessages.getByTestId('audio-media-demo-audio-01');

    await firstButton.click();
    await expect(firstCard).toHaveAttribute('data-audio-state', 'playing');

    await firstMedia.evaluate((element) => element.dispatchEvent(new Event('ended')));

    await expect(firstCard).toHaveAttribute('data-audio-state', 'idle');
    await expect(firstButton).toHaveAccessibleName(/Reproducir mensaje:/);
    await expect(firstButton).toHaveAttribute('aria-pressed', 'false');

    await firstButton.click();

    await expect(firstCard).toHaveAttribute('data-audio-state', 'playing');
    await expect(firstMedia).toHaveAttribute('src', '/audio/demo/audio-01.mp3');
  });
});
