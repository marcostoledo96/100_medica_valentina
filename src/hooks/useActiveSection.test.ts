import { act, render, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { narrativeSections } from '../content/sections';
import {
  ACTIVE_SECTION_ROOT_MARGIN,
  ACTIVE_SECTION_THRESHOLDS,
  useActiveSection,
} from './useActiveSection';

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly observe = vi.fn();
  readonly disconnect = vi.fn();

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit
  ) {
    MockIntersectionObserver.instances.push(this);
  }

  emit(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

function renderSectionTargets() {
  render(
    createElement(
      'div',
      null,
      narrativeSections.map((section) =>
        createElement('section', { key: section.id, id: section.id })
      )
    )
  );
}

function entryFor(id: string, ratio: number, isIntersecting = ratio > 0) {
  return {
    target: document.getElementById(id),
    intersectionRatio: ratio,
    isIntersecting,
  } as unknown as IntersectionObserverEntry;
}

describe('useActiveSection', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('starts at a valid current fragment before observing visibility', () => {
    window.history.replaceState({}, '', '/#linea-tiempo');
    renderSectionTargets();

    const { result, unmount } = renderHook(() => useActiveSection(narrativeSections));

    expect(result.current).toBe('linea-tiempo');
    unmount();
  });

  it('uses the first ordered section when the current fragment is unknown', () => {
    window.history.replaceState({}, '', '/#seccion-inexistente');
    const { result, unmount } = renderHook(() => useActiveSection(narrativeSections));

    expect(result.current).toBe('inicio');
    unmount();
  });

  it('observes known sections with deterministic thresholds and root margin', () => {
    renderSectionTargets();
    const { unmount } = renderHook(() => useActiveSection(narrativeSections));
    const observer = MockIntersectionObserver.instances[0];

    expect(observer).toBeDefined();
    expect(observer?.options).toMatchObject({
      root: null,
      rootMargin: ACTIVE_SECTION_ROOT_MARGIN,
      threshold: [...ACTIVE_SECTION_THRESHOLDS],
    });
    expect(observer?.observe).toHaveBeenCalledTimes(narrativeSections.length);
    expect(observer?.observe.mock.calls.map(([element]) => (element as HTMLElement).id)).toEqual(
      narrativeSections.map((section) => section.id)
    );

    unmount();
    expect(observer?.disconnect).toHaveBeenCalledTimes(1);
  });

  it('selects the most visible intersecting section from simultaneous entries', () => {
    renderSectionTargets();
    const { result, unmount } = renderHook(() => useActiveSection(narrativeSections));
    const observer = MockIntersectionObserver.instances[0];

    act(() => {
      observer?.emit([
        entryFor('linea-tiempo', 0.8),
        entryFor('inicio', 0.25),
        entryFor('expediente', 0.45),
      ]);
    });

    expect(result.current).toBe('linea-tiempo');
    unmount();
  });

  it('uses configuration order as the stable tie-breaker', () => {
    renderSectionTargets();
    const { result, unmount } = renderHook(() => useActiveSection(narrativeSections));
    const observer = MockIntersectionObserver.instances[0];

    act(() => {
      observer?.emit([entryFor('linea-tiempo', 0.5), entryFor('expediente', 0.5)]);
    });

    expect(result.current).toBe('expediente');
    unmount();
  });

  it('tracks rapid exits and entries without losing the latest visible candidate', () => {
    renderSectionTargets();
    const { result, unmount } = renderHook(() => useActiveSection(narrativeSections));
    const observer = MockIntersectionObserver.instances[0];

    act(() => {
      observer?.emit([entryFor('inicio', 0.6), entryFor('expediente', 0.4)]);
    });
    expect(result.current).toBe('inicio');

    act(() => {
      observer?.emit([entryFor('inicio', 0, false), entryFor('expediente', 0.3)]);
    });
    expect(result.current).toBe('expediente');

    act(() => {
      observer?.emit([entryFor('expediente', 0, false)]);
    });
    expect(result.current).toBe('expediente');
    unmount();
  });

  it('follows native hash changes while keeping section IDs in configuration order', () => {
    renderSectionTargets();
    const { result, unmount } = renderHook(() => useActiveSection(narrativeSections));

    expect(result.current).toBe('inicio');

    act(() => {
      window.history.pushState({}, '', '/#final');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(result.current).toBe('final');
    unmount();
  });

  it('ignores entries for elements outside the known configuration', () => {
    renderSectionTargets();
    const unknownElement = document.createElement('section');
    unknownElement.id = 'desconocida';
    document.body.appendChild(unknownElement);
    const { result, unmount } = renderHook(() => useActiveSection(narrativeSections));
    const observer = MockIntersectionObserver.instances[0];

    act(() => {
      observer?.emit([entryFor('desconocida', 1)]);
    });

    expect(result.current).toBe('inicio');
    unmount();
    unknownElement.remove();
  });

  it.each([
    { hash: '#linea-tiempo', expected: 'linea-tiempo' },
    { hash: '#seccion-inexistente', expected: 'inicio' },
  ])(
    'keeps the valid hash/first fallback without scroll listeners when IntersectionObserver is unavailable',
    ({ hash, expected }) => {
      window.history.replaceState({}, '', `/${hash}`);
      vi.stubGlobal('IntersectionObserver', undefined);
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { result, unmount } = renderHook(() => useActiveSection(narrativeSections));

      expect(result.current).toBe(expected);
      expect(addEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));
      expect(addEventListenerSpy.mock.calls.map(([eventName]) => eventName)).not.toEqual(
        expect.arrayContaining(['scroll', 'wheel', 'touchmove'])
      );
      expect(addEventListenerSpy).not.toHaveBeenCalledWith('scroll', expect.anything());
      expect(addEventListenerSpy).not.toHaveBeenCalledWith('wheel', expect.anything());
      expect(addEventListenerSpy).not.toHaveBeenCalledWith('touchmove', expect.anything());
      expect(MockIntersectionObserver.instances).toHaveLength(0);

      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));
      expect(removeEventListenerSpy.mock.calls.map(([eventName]) => eventName)).not.toEqual(
        expect.arrayContaining(['scroll', 'wheel', 'touchmove'])
      );
    }
  );
});
