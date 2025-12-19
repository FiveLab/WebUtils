import { beforeEach, describe, expect, it } from 'vitest';
import { hideElement, showElement } from '../../src';

describe('dom visibility', () => {
    let innerEl: HTMLElement;
    let outerEl: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="root"><div class="inner"></div><div class="outer d-none"></div></div>'
        innerEl = document.querySelector('.inner')!;
        outerEl = document.querySelector('.outer')!;
    });

    it('show element', () => {
        showElement(outerEl);

        expect(outerEl.classList.contains('d-none')).toBeFalsy();
    });

    it('hide element', () => {
        hideElement(innerEl);

        expect(innerEl.classList.contains('d-none')).toBeTruthy();
    });
});
