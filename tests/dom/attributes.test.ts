import { beforeEach, describe, expect, it } from 'vitest';
import { readBoolAttribute } from '../../src/dom';

describe('read boolean attribute', () => {
    let el: HTMLDivElement;

    beforeEach(() => {
        el = document.createElement('div');
    });

    it.each([
        ['1', true],
        ['yes', true],
        ['true', true],
        ['0', false],
        ['no', false],
        ['false', false]
    ])('read(%s) -> %s', (attrValue: string, expected: boolean) => {
        el.setAttribute('data-attr', attrValue);

        expect(readBoolAttribute(el, 'data-attr')).toBe(expected);
    });

    it('undefined if missed', () => {
        expect(readBoolAttribute(el, 'data-attr')).toBeUndefined();
    });

    it('return default if missed', () => {
        expect(readBoolAttribute(el, 'data-attr', false)).toBeFalsy();
    });
});
