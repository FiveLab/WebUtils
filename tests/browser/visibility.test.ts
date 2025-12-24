import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IntersectionObserverMock } from '../mock/intersection-observer';
import { observeElementVisibility } from '../../src/browser/visibility';

describe('observe element visibility', () => {
    let element: HTMLElement;

    beforeEach(() => {
        element = document.createElement('div');
    });

    it('calls callback when element becomes visible', () => {
        const cb = vi.fn();

        observeElementVisibility(element, cb);

        const observer = IntersectionObserverMock.instance!;

        observer.trigger([{
            target: element,
            isIntersecting: true,
        }]);

        expect(cb).toHaveBeenCalledOnce();
        expect(cb).toHaveBeenCalledWith(element, true);
    });

    it('unobserves element when once=true and visible', () => {
        const cb = vi.fn();

        observeElementVisibility(element, cb, {once: true});

        const observer = IntersectionObserverMock.instance!;
        observer.trigger([{
            target: element,
            isIntersecting: true,
        }]);

        expect(cb).toHaveBeenCalledOnce();
        expect(observer.unobserve).toHaveBeenCalledWith(element);
    });

    it('does not unobserve on hidden when once=true', () => {
        const cb = vi.fn();

        observeElementVisibility(element, cb, {once: true});

        const observer = IntersectionObserverMock.instance!;
        observer.trigger([{
            target: element,
            isIntersecting: false,
        }]);

        expect(cb).toHaveBeenCalledOnce();
        expect(observer.unobserve).not.toHaveBeenCalled();
    });
});
