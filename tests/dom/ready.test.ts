import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onDomReady } from '../../src/dom';

describe('on dom ready', () => {
    beforeEach(() => {
        Object.defineProperty(document, 'readyState', {
            configurable: true,
            get: () => 'complete'
        });
    });

    it('calls callback immediately when DOM is ready', () => {
        const cb = vi.fn();

        onDomReady(cb);

        expect(cb).toHaveBeenCalledOnce();
    });

    it('calls callbacks (more than one) immediately when DOM is ready', () => {
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        onDomReady([cb1, cb2]);

        expect(cb1).toHaveBeenCalledOnce();
        expect(cb2).toHaveBeenCalledOnce();
    });

    it('waits for DOMContentLoaded when DOM is loading', () => {
        const cb = vi.fn();

        Object.defineProperty(document, 'readyState', {
            configurable: true,
            get: () => 'loading'
        });

        onDomReady(cb);

        expect(cb).not.toHaveBeenCalled();

        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(cb).toHaveBeenCalledOnce();
    });
});