import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { animateEllipsis } from '../../src/dom';

describe('animate ellipsis', () => {
    let element: HTMLElement;

    beforeEach(() => {
        vi.useFakeTimers();
        element = document.createElement('div');
        document.body.appendChild(element);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('adds ellipsis container with dots', () => {
        animateEllipsis(element);

        const spans = element.querySelectorAll('span span');

        expect(spans.length).toBe(3);

        spans.forEach((dot) => {
            expect(dot.textContent).toBe('.');
        });
    });

    it('animates dots over time', () => {
        animateEllipsis(element, {interval: 100});

        const dots = Array.from(element.querySelectorAll('span span')) as HTMLElement[];

        // start: 1 dot visible
        vi.advanceTimersByTime(100);
        expect(dots.filter(d => d.style.visibility !== 'hidden').length).toBe(2);

        // 2 dots
        vi.advanceTimersByTime(100);
        expect(dots.filter(d => d.style.visibility !== 'hidden').length).toBe(3);

        // 3 dots
        vi.advanceTimersByTime(100);
        expect(dots.filter(d => d.style.visibility !== 'hidden').length).toBe(0);

        // reset (0 dots)
        vi.advanceTimersByTime(100);
        expect(dots.filter(d => d.style.visibility !== 'hidden').length).toBe(1);
    });

    it('removes ellipsis and stops animation on stop()', () => {
        const stop = animateEllipsis(element);

        expect(element.querySelector('span')).not.toBeNull();

        stop();

        expect(element.querySelector('span')).toBeNull();

        // advancing timers should not re-add anything
        vi.advanceTimersByTime(1000);
        expect(element.querySelector('span')).toBeNull();
    });

    it('auto-stops when element is removed from DOM', () => {
        animateEllipsis(element);

        element.remove();

        vi.advanceTimersByTime(500);

        // no error and no DOM left
        expect(document.body.contains(element)).toBe(false);
    });

    it('respects custom maxDots option', () => {
        animateEllipsis(element, {maxDots: 5});

        const dots = element.querySelectorAll('span span');
        expect(dots.length).toBe(5);
    });
});
