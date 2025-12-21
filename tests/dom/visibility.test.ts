import { beforeEach, describe, expect, it } from 'vitest';
import { hideElement, showElement } from '../../src/dom';

describe('dom visibility', () => {
    let innerEl: HTMLElement;
    let outerEl: HTMLElement;
    let displayNoneEl: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="root">' +
            '<div class="inner"></div>' +
            '<div class="outer d-none"></div>' +
            '<div class="display-none" style="display: none"></div>' +
            '</div>';

        innerEl = document.querySelector('.inner')!;
        outerEl = document.querySelector('.outer')!;
        displayNoneEl = document.querySelector('.display-none')!;
    });

    it('show element', () => {
        showElement(outerEl);

        expect(outerEl.classList.contains('d-none')).toBeFalsy();
    });

    it('remove display none on show element', () => {
        showElement(displayNoneEl);

        expect(outerEl.style.display).toBe('');
    });

    it('hide element', () => {
        hideElement(innerEl);

        expect(innerEl.classList.contains('d-none')).toBeTruthy();
    });
});
