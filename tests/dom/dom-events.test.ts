import { beforeEach, describe, expect, it, vi } from 'vitest';
import { onDomEvents } from '../../src';

describe('on dom events', () => {
    let innerEl: HTMLSpanElement;
    let outerEl: HTMLSpanElement;
    let inputEl: HTMLInputElement;
    let rootEl: HTMLDivElement;

    const eventOptions: EventInit = {
        bubbles: true,
    };

    beforeEach(() => {
        document.body.innerHTML = '<div id="root"><span class="inner"><input type="text"/></span><span class="outer"></span></div>';

        innerEl = document.querySelector('.inner')!
        outerEl = document.querySelector('.outer')!;
        inputEl = document.querySelector('input')!;
        rootEl = document.querySelector('#root')!;
    });

    it('add click handler', () => {
        const cb = vi.fn();

        onDomEvents('click', '.inner', cb);

        rootEl.dispatchEvent(new Event('click', eventOptions));
        innerEl.dispatchEvent(new Event('click', eventOptions));

        expect(cb).toHaveBeenCalledOnce();
        expect(cb).toHaveBeenCalledWith(innerEl, expect.any(Event));
    });

    it('add change handler', () => {
        const cb = vi.fn();

        onDomEvents('change', 'input', cb);

        inputEl.dispatchEvent(new Event('change', eventOptions));

        expect(cb).toHaveBeenCalledOnce();
        expect(cb).toHaveBeenCalledWith(inputEl, expect.any(Event));
    });

    it('add multiple handlers', () => {
        const innerCb = vi.fn();
        const outerCb = vi.fn();

        onDomEvents('click', {
            selectors: {
                '.inner': innerCb,
                'span.outer': outerCb
            }
        });

        rootEl.dispatchEvent(new Event('click', eventOptions));
        innerEl.dispatchEvent(new Event('click', eventOptions));
        outerEl.dispatchEvent(new Event('click', eventOptions));

        expect(innerCb).toHaveBeenCalledOnce();
        expect(innerCb).toHaveBeenCalledWith(innerEl, expect.any(Event));

        expect(outerCb).toHaveBeenCalledOnce();
        expect(outerCb).toHaveBeenCalledWith(outerEl, expect.any(Event));
    });
});
