import { vi } from 'vitest';

export class IntersectionObserverMock {
    static instance: IntersectionObserverMock | null = null;

    readonly observe = vi.fn();
    readonly unobserve = vi.fn();

    private callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;

        IntersectionObserverMock.instance = this;
    }

    trigger(entries: Partial<IntersectionObserverEntry>[]) {
        let normalizedEntries = entries.map((e) => {
            return {
                isIntersecting: false,
                target: document.createElement('div'),
                ...e
            } as IntersectionObserverEntry;
        });

        this.callback(normalizedEntries, this as unknown as IntersectionObserver);
    }
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock as any);