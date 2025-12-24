import { beforeEach, describe, expect, it } from 'vitest';
import { createElementFromHtml, replaceElement, replaceHtmlString } from '../../src/dom/html';

describe('replace html string', () => {
    it('success replace', () => {
        const el = document.createElement('div');
        el.setAttribute('data-index', '__index__');
        el.textContent = 'Proto: __prototype__';

        const newEl = replaceHtmlString(el, {
            '__index__': '1',
            '__prototype__': 'prototype'
        });

        expect(newEl.getAttribute('data-index')).toBe('1');
        expect(newEl.textContent).toBe('Proto: prototype');
    });
});

describe('create element from html', () => {
    it('success create', () => {
        const el = createElementFromHtml('<div id="bla" data-id="bar">123</div>');

        expect(el.getAttribute('id')).toBe('bla');
        expect(el.getAttribute('data-id')).toBe('bar');
        expect(el.innerHTML).toBe('123');
    });

    it('error with non html element', () => {
        expect(() => {
            createElementFromHtml('bla bar');
        }).toThrowError(new Error('createElementFromHtml: HTML did not produce a HTMLElement'));
    })
});

describe('replace element', () => {
    const checkExistNewElement = (newEl: Element) => {
        expect(document.querySelector('.child-1')).toBeNull();
        expect(document.querySelector('.child-1-1')).toBeNull();
        expect(document.querySelector('.new-child')).toBe(newEl);
        expect(document.querySelector('.child-2')).not.toBeNull();
    };

    beforeEach(() => {
        document.body.innerHTML = '<div id="root">' +
            '<div class="child-1"><span class="child-1-1"></span></div>' +
            '<div class="child-2"></div>' +
            '</div>';
    });

    it('replace with raw html', () => {
        const newEl = replaceElement(document.querySelector('.child-1')!, '<span class="new-child">123</span>');

        expect(newEl.getAttribute('class')).toBe('new-child');
        expect(newEl.innerHTML).toBe('123');

        checkExistNewElement(newEl);
    });

    it('replace with element', () => {
        const newEl = createElementFromHtml('<span class="new-child"></span>');
        newEl.classList.add('new-child');
        newEl.textContent = '123';

        replaceElement(document.querySelector('.child-1')!, newEl);

        checkExistNewElement(newEl);
    })
});
