import { describe, expect, it } from 'vitest';
import { createElement } from '../../src/dom';

describe('create element', () => {
    it('creates element with id and classes', () => {
        const el = createElement('div', {
            id: 'x',
            classList: ['a', 'b'],
        });

        expect(el).toBeInstanceOf(HTMLDivElement);
        expect(el.id).toBe('x');
        expect([...el.classList]).toEqual(expect.arrayContaining(['a', 'b']));
    });

    it('sets textContent (including empty string)', () => {
        const el1 = createElement('span', { text: 'hello' });
        expect(el1.textContent).toBe('hello');

        const el2 = createElement('span', { text: '' });
        expect(el2.textContent).toBe('');
    });

    it('sets innerHTML (including empty string)', () => {
        const el1 = createElement('div', { html: '<b>x</b>' });
        expect(el1.innerHTML).toBe('<b>x</b>');

        const el2 = createElement('div', { html: '' });
        expect(el2.innerHTML).toBe('');
    });

    it('sets dataset and normalizes boolean to "true"/"false"', () => {
        const el = createElement('div', {
            dataset: {
                foo: 'bar',
                enabled: true,
                disabled: false,
                zero: 0,
            },
        });

        expect(el.dataset.foo).toBe('bar');
        expect(el.dataset.enabled).toBe('true');
        expect(el.dataset.disabled).toBe('false');
        expect(el.dataset.zero).toBe('0');
    });

    it('sets attrs and normalizes boolean to "1"/"0"', () => {
        const el = createElement('div', {
            attrs: {
                'data-x': 'y',
                'data-yes': true,
                'data-no': false,
                'data-zero': 0,
            },
        });

        expect(el.getAttribute('data-x')).toBe('y');
        expect(el.getAttribute('data-yes')).toBe('1');
        expect(el.getAttribute('data-no')).toBe('0');
        expect(el.getAttribute('data-zero')).toBe('0');
    });

    it('skips null/undefined attributes and dataset values', () => {
        const el = createElement('div', {
            attrs: {
                'data-a': null,
                'data-b': undefined,
                'data-c': 'ok',
            },
            dataset: {
                a: null,
                b: undefined,
                c: 'ok',
            },
        });

        expect(el.hasAttribute('data-a')).toBe(false);
        expect(el.hasAttribute('data-b')).toBe(false);
        expect(el.getAttribute('data-c')).toBe('ok');

        expect('a' in el.dataset).toBe(false);
        expect('b' in el.dataset).toBe(false);
        expect(el.dataset.c).toBe('ok');
    });

    it('applies style', () => {
        const el = createElement('div', {
            style: {
                display: 'none',
            },
        });

        expect(el.style.display).toBe('none');
    });

    it('creates anchor and applies href/target', () => {
        const a = createElement('a', {
            href: '/admin',
            target: '_blank',
            text: 'Open',
        });

        expect(a).toBeInstanceOf(HTMLAnchorElement);
        expect(a.target).toBe('_blank');
        expect(a.href).toBe('http://localhost:3000/admin');
        expect(a.textContent).toBe('Open');
    });

    it('creates anchor with URL', () => {
        const a = createElement('a', {
            href: new URL('/path', 'https://domain.local/')
        });

        expect(a.href).toBe('https://domain.local/path');
    });

    it('creates script and applies options', () => {
        const el = createElement('script', {
            src: '/some.js',
            defer: true,
            async: true,
            type: 'text/javascript',
        });

        expect(el).toBeInstanceOf(HTMLScriptElement);
        expect(el.src, '/some.js');
        expect(el.defer).toBeTruthy();
        expect(el.async).toBeTruthy();
        expect(el.type).toBe('text/javascript')
    });

    it('creates script with URL', () => {
        const el = createElement('script', {
            src: new URL('/some.js', 'https://domain.local')
        });

        expect(el.src).toBe('https://domain.local/some.js');
    });

    it('creates link and applies options', () => {
        const el = createElement('link', {
            as: 'foo',
            rel: 'stylesheet',
            href: '/some.css',
            type: 'text/css',
            media: 'print',
            title: 'My Style'
        });

        expect(el.as).toBe('foo');
        expect(el.rel).toBe('stylesheet');
        expect(el.href).toBe('http://localhost:3000/some.css');
        expect(el.type).toBe('text/css');
        expect(el.media).toBe('print');
        expect(el.title).toBe('My Style');
    });

    it('creates link with URL', () => {
        const el = createElement('link', {
            href: new URL('/some.css', 'https://domain.local')
        });

        expect(el.href).toBe('https://domain.local/some.css');
    });
});
