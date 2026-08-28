export const BOOT_INTRO_SEEN_STORAGE_KEY = '100-medica-valentina:boot:intro-seen';

export interface BootStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

function getBrowserStorage(): BootStorage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function isPersistedIntroSeen(value: unknown): boolean {
  if (value === true) {
    return true;
  }

  if (typeof value !== 'object' || value === null || !('introSeen' in value)) {
    return false;
  }

  return value.introSeen === true;
}

export function readIntroSeen(storage?: BootStorage): boolean {
  const resolvedStorage = storage ?? getBrowserStorage();

  if (!resolvedStorage) {
    return false;
  }

  try {
    const storedValue = resolvedStorage.getItem(BOOT_INTRO_SEEN_STORAGE_KEY);

    if (storedValue === 'true') {
      return true;
    }

    if (!storedValue) {
      return false;
    }

    return isPersistedIntroSeen(JSON.parse(storedValue) as unknown);
  } catch {
    return false;
  }
}

export function persistIntroSeen(storage?: BootStorage): void {
  const resolvedStorage = storage ?? getBrowserStorage();

  if (!resolvedStorage) {
    return;
  }

  try {
    resolvedStorage.setItem(BOOT_INTRO_SEEN_STORAGE_KEY, 'true');
  } catch {
    // Storage is an enhancement; the Boot experience remains usable when it is unavailable.
  }
}
