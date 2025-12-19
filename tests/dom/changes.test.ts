import { beforeEach, describe, expect, it, vi } from 'vitest';
import { onDomChanges } from '../../src';

describe('on dom changes', () => {
    beforeEach(() => {
        document.body.innerHTML = '';

        Object.defineProperty(document, 'readyState', {
            configurable: true,
            get: () => 'complete'
        });
    });

    it('success listen changes without selector', async () => {
        document.body.innerHTML = '<div id="root"></div>';

        const cb = vi.fn();

        onDomChanges({subtree: true, childList: true}, cb);

        const nested = document.createElement('span');
        document.querySelector('#root')!.appendChild(nested);

        await vi.waitFor(() => {
            expect(cb).toHaveBeenCalledOnce();
            expect(cb).toHaveBeenCalledWith(nested, expect.any(MutationRecord));
        });
    });

    it('success listen changes with selector', async () => {
        document.body.innerHTML = '<div id="root"></div>';
        const rootEl = document.getElementById('root')!;

        const cb = vi.fn();

        onDomChanges({subtree: true, childList: true, selector: '.some'}, cb);

        const nested1 = document.createElement('span');
        nested1.classList.add('foo-bar');

        const nested2 = document.createElement('span');
        nested2.classList.add('some');

        rootEl.appendChild(nested1);
        rootEl.appendChild(nested2);

        await vi.waitFor(() => {
            expect(cb).toHaveBeenCalledOnce();
            expect(cb).toHaveBeenCalledWith(nested2, expect.any(MutationRecord));
        });
    });

    it('success listen attribute change without selector', async () => {
        document.body.innerHTML = '<div id="root"></div>';

        const cb = vi.fn();

        onDomChanges({attributes: true, subtree: true}, cb);

        document.querySelector('#root')!.setAttribute('bar', 'foo');

        await vi.waitFor(() => {
            expect(cb).toHaveBeenCalledOnce();
            expect(cb).toHaveBeenCalledWith(expect.any(HTMLDivElement), expect.any(MutationRecord));
        });
    });

    it('success listen attribute change with selector', async () => {
        document.body.innerHTML = '<div id="root"><span id="inner"></span></div>';

        const cb = vi.fn();

        onDomChanges({attributes: true, subtree: true, attributeFilter: ['foo']}, cb);

        document.querySelector('#root')!.setAttribute('bar', 'foo');
        document.querySelector('#inner')!.setAttribute('foo', 'bar');

        await vi.waitFor(() => {
            expect(cb).toHaveBeenCalledOnce();
            expect(cb).toHaveBeenCalledWith(expect.any(HTMLSpanElement), expect.any(MutationRecord));
        });
    });

    it('success listen multiple selectors', async () => {
        document.body.innerHTML = '<div id="root"></div>';

        const cbCopy = vi.fn();
        const cbProcessing = vi.fn();

        onDomChanges({
            subtree: true,
            childList: true,
            selectors: {
                '[data-copy]': cbCopy,
                'span[data-processing]': cbProcessing
            }
        });

        document.body.appendChild(document.createElement('span'));

        const copyEl = document.createElement('span');
        copyEl.setAttribute('data-copy', '1');
        document.body.appendChild(copyEl);

        const processingEl = document.createElement('span');
        processingEl.setAttribute('data-processing', '1');
        document.body.appendChild(processingEl);

        await vi.waitFor(() => {
            expect(cbCopy).toHaveBeenCalledOnce();
            expect(cbCopy).toHaveBeenCalledWith(copyEl, expect.any(MutationRecord));

            expect(cbProcessing).toHaveBeenCalledOnce();
            expect(cbProcessing).toHaveBeenCalledWith(processingEl, expect.any(MutationRecord));
        });
    });

    it('should success apply on dom ready', async () => {
        document.body.innerHTML = '<div id="root"><span data-copy></span></div>';

        const cb = vi.fn();

        onDomChanges({
            subtree: true,
            childList: true,
            selector: '[data-copy]',
            onDomReady: true
        }, cb);

        await vi.waitFor(() => {
            expect(cb).toHaveBeenCalledOnce();
            expect(cb).toHaveBeenCalledWith(expect.any(HTMLSpanElement), undefined);
        });
    });
});
