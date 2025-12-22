import { describe, expect, it } from 'vitest';
import { processingBehavior } from '../../src/behaviors/processing';

const assertNotProcessing = (el: HTMLElement) => {
    expect(el.getAttribute('disabled')).toBeNull();
    expect(el.querySelector('[role="status"]')).toBeNull();
    expect([...el.classList]).toStrictEqual([]);
    expect(el.innerHTML).contains('button content');
};

describe('processing', () => {
    it.each([
        ['button', []],
        ['a', ['disabled']]
    ])('processing for tag "%s" with prepend mode', (tagName, expectedClasses) => {
        const el = document.createElement(tagName);
        el.textContent = 'button content';

        el.setAttribute('data-processing', '1');
        processingBehavior(el, undefined);

        expect(el.getAttribute('disabled')).toBeTruthy();
        expect(el.querySelector('[role="status"]')).not.toBeNull();
        expect([...el.classList]).toStrictEqual(expectedClasses);
        expect(el.innerHTML).contains('button content');

        el.setAttribute('data-processing', '0');
        processingBehavior(el, undefined);

        assertNotProcessing(el);
    });

    it('set processing with replace mode', () => {
        const el = document.createElement('a');
        el.textContent = 'button content';

        el.setAttribute('data-processing', '1');
        el.setAttribute('data-processing-mode', 'replace');
        processingBehavior(el, undefined);

        expect(el.getAttribute('disabled')).toBeTruthy();
        expect(el.querySelector('[role="status"]')).not.toBeNull();
        expect(el.innerHTML).not.contains('button content');

        el.setAttribute('data-processing', '0');
        processingBehavior(el, undefined);

        assertNotProcessing(el);
    });
});
