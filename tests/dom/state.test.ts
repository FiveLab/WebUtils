import { beforeEach, describe, expect, it } from 'vitest';
import { disableElement, enableElement, isDisabled } from '../../src';

describe('element states', () => {
    let el: HTMLElement;

    beforeEach(() => {
        el = document.createElement('div');
    });

    it('enable element', () => {
        el.setAttribute('disabled', 'disabled');
        enableElement(el);

        expect(el.hasAttribute('disabled')).toBeFalsy();
        expect(isDisabled(el)).toBeFalsy();
    });

    it('disable element', () => {
        disableElement(el);

        expect(el.hasAttribute('disabled')).toBeTruthy();
        expect(el.getAttribute('disabled')).toBe('disabled');
        expect(isDisabled(el)).toBeTruthy();
    });
});
