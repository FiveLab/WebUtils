import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyTextareaAutoResize } from '../../src/dom';
import { kAttrMaxRows } from '../../src/core/constants';

describe('apply textarea auto resize', () => {
    let textarea: HTMLTextAreaElement;

    beforeEach(() => {
        textarea = document.createElement('textarea');
        textarea.value = 'line1\nline2\nline3';

        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            fontSize: '16px',
            lineHeight: '20px',
            paddingTop: '4px',
            paddingBottom: '6px',
        } as CSSStyleDeclaration);
    });

    it('sets height based on number of lines', () => {
        applyTextareaAutoResize(textarea, 10);

        // 3 lines * 20px + (4 + 6) padding = 70px
        expect(textarea.style.height).toBe('70px');
    });

    it('respects maxRows argument', () => {
        applyTextareaAutoResize(textarea, 2);

        // max 2 lines * 20px + padding = 50px
        expect(textarea.style.height).toBe('50px');
    });

    it('uses max rows from data attribute when present', () => {
        textarea.setAttribute(kAttrMaxRows, '1');

        applyTextareaAutoResize(textarea, 5);

        // attribute overrides argument
        expect(textarea.style.height).toBe('30px');
    });

    it('falls back to default when data attribute is invalid', () => {
        textarea.setAttribute(kAttrMaxRows, 'NaN');

        applyTextareaAutoResize(textarea, 2);

        expect(textarea.style.height).toBe('50px');
    });

    it('handles line-height: normal', () => {
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            fontSize: '10px',
            lineHeight: 'normal',
            paddingTop: '0px',
            paddingBottom: '0px',
        } as CSSStyleDeclaration);

        textarea.value = 'a\nb';

        applyTextareaAutoResize(textarea, 5);

        // lineHeight = fontSize * 1.2 = 12 (2 * 12 = 24)
        expect(textarea.style.height).toBe('24px');
    });

    it('handles empty textarea as one line', () => {
        textarea.value = '';

        applyTextareaAutoResize(textarea, 5);

        expect(textarea.style.height).toBe('30px'); // 1 * 20 + 10
    });
});
