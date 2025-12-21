import { beforeEach, describe, expect, it } from 'vitest';
import { existsEmbeddedData, readEmbeddedData } from '../../src/dom/embedded-data';

describe('exists embedded data', () => {
    beforeEach(() => {
        document.head.innerHTML = '<script type="application/json" id="byid"></script>' +
            '<script type="application/json" data-by-attr-id></script>';
    });

    it.each([
        ['byid', true],
        ['by-attr-id', true],
        ['missed', false]
    ])('exists(%s) -> %s', (id, expected) => {
        const result = existsEmbeddedData(id);

        expect(result).toBe(expected);
    });
});

describe('read embedded data', () => {
    beforeEach(() => {
        document.head.innerHTML = '<script type="application/json" id="my-data">{"foo":"bar"}</script>' +
            '<script type="application/json" data-empty-data></script>';
    });

    it.each([
        ['my-data', {foo: 'bar'}],
        ['empty-data', null]
    ])('read(%s) -> %j', (id, expected) => {
        const result = readEmbeddedData(id);

        expect(result).toStrictEqual(expected);
    });

    it('read from script element', () => {
        const el = <HTMLScriptElement>document.getElementById('my-data');
        const result = readEmbeddedData(el);

        expect(result).toStrictEqual({foo: 'bar'});
    });

    it('error read from another element', () => {
        const el = document.createElement('span');

        expect(() => {
            readEmbeddedData(<HTMLScriptElement>el);
        }).toThrowError(new Error('Can\'t read embedded data from "SPAN" node.'));
    });

    it('throw error for unknown element', () => {
        expect(() => {
            readEmbeddedData(<HTMLScriptElement>{});
        }).toThrowError(new TypeError('Unknown input script.'));
    })

    it('error for not existence script', () => {
        expect(() => {
            readEmbeddedData('blabla');
        }).toThrowError(new Error('Can\'t find script[type="application/json"] with id "blabla".'));
    });
});
