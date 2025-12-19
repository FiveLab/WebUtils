import { beforeEach, describe, expect, it } from 'vitest';
import { readBoolAttribute } from '../../src';

describe('dom attributes', () => {
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
    ])('read boolean attribute (%s, %s)', (attrValue: string, expected: boolean) => {
        el.setAttribute('data-attr', attrValue);

        expect(readBoolAttribute(el, 'data-attr')).toBe(expected);
    });

    it('success read for missed attr', () => {
        expect(readBoolAttribute(el, 'data-attr')).toBeFalsy();
    });

    it('undefined if missed attr', () => {
        expect(readBoolAttribute(el, 'data-attr')).toBeUndefined();
    });

    it('return default if missed attr', () => {
        expect(readBoolAttribute(el, 'data-attr', false)).toBeFalsy();
    });
});
