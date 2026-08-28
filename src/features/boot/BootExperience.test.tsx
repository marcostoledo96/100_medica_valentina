import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BootExperience } from './BootExperience';
import { BOOT_INTRO_SEEN_STORAGE_KEY, type BootStorage } from './bootPersistence';

const PRESERVED_STORAGE_KEY = 'boot-test:unrelated';
const PRESERVED_STORAGE_VALUE = 'preserve-me';

function createStorage(initialValue: string | null = null): BootStorage & {
  removeItem: ReturnType<typeof vi.fn>;
  value: string | null;
} {
  const values = new Map<string, string>();
  if (initialValue !== null) {
    values.set(BOOT_INTRO_SEEN_STORAGE_KEY, initialValue);
  }
  values.set(PRESERVED_STORAGE_KEY, PRESERVED_STORAGE_VALUE);

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, nextValue: string) => {
      values.set(key, nextValue);
    }),
    removeItem: vi.fn((key: string) => {
      values.delete(key);
    }),
    get value() {
      return values.get(BOOT_INTRO_SEEN_STORAGE_KEY) ?? null;
    },
  };
}

describe('BootExperience controller', () => {
  it('offers the intro on a first visit', () => {
    const storage = createStorage();

    render(<BootExperience storage={storage} />);

    expect(screen.getByRole('link', { name: 'Abrir expediente' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Saltar intro' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Reproducir introducción' })
    ).not.toBeInTheDocument();
    expect(storage.getItem).toHaveBeenCalledWith(BOOT_INTRO_SEEN_STORAGE_KEY);
  });

  it('renders the revisit state directly when introSeen is already persisted', () => {
    const storage = createStorage('true');

    render(<BootExperience storage={storage} />);

    expect(
      screen.getByText('Este acceso ya fue revisado. El expediente está disponible.')
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Reproducir introducción' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Saltar intro' })).not.toBeInTheDocument();
  });

  it.each([
    ['malformed JSON', '{not-json}'],
    ['false JSON', 'false'],
    ['an unrelated value', 'other-value'],
  ])('treats %s storage as a first visit', (_description, value) => {
    const storage = createStorage(value);

    render(<BootExperience storage={storage} />);

    expect(screen.getByRole('link', { name: 'Saltar intro' })).toBeVisible();
  });

  it('survives storage read and write failures without breaking the intro', async () => {
    const storage: BootStorage = {
      getItem: vi.fn(() => {
        throw new Error('storage unavailable');
      }),
      setItem: vi.fn(() => {
        throw new Error('storage unavailable');
      }),
    };
    const user = userEvent.setup();

    render(<BootExperience storage={storage} />);

    expect(screen.getByRole('link', { name: 'Abrir expediente' })).toBeVisible();
    await user.click(screen.getByRole('link', { name: 'Saltar intro' }));
    expect(
      screen.getByText('Este acceso ya fue revisado. El expediente está disponible.')
    ).toBeVisible();
  });

  it('persists both skip and open actions', async () => {
    const storage = createStorage();
    const user = userEvent.setup();
    const { unmount } = render(<BootExperience storage={storage} />);

    await user.click(screen.getByRole('link', { name: 'Saltar intro' }));
    expect(storage.setItem).toHaveBeenCalledWith(BOOT_INTRO_SEEN_STORAGE_KEY, 'true');
    unmount();

    const secondStorage = createStorage();
    render(<BootExperience storage={secondStorage} />);
    await user.click(screen.getByRole('link', { name: 'Abrir expediente' }));
    expect(secondStorage.setItem).toHaveBeenCalledWith(BOOT_INTRO_SEEN_STORAGE_KEY, 'true');
  });

  it('replays without deleting or clearing the persisted Boot state', async () => {
    const storage = createStorage('true');
    const user = userEvent.setup();

    render(<BootExperience storage={storage} />);

    const scene = screen.getByTestId('boot-scan').closest<HTMLElement>('[data-boot-scene="true"]');
    expect(scene).toHaveAttribute('data-boot-state', 'revisit');

    await user.click(screen.getByRole('button', { name: 'Reproducir introducción' }));

    expect(scene).toHaveAttribute('data-boot-state', 'intro');
    expect(screen.getByRole('link', { name: 'Saltar intro' })).toBeVisible();
    expect(storage.getItem(BOOT_INTRO_SEEN_STORAGE_KEY)).toBe('true');
    expect(storage.getItem(PRESERVED_STORAGE_KEY)).toBe(PRESERVED_STORAGE_VALUE);
    expect(storage.value).toBe('true');
    expect(storage.removeItem).not.toHaveBeenCalled();
  });
});
