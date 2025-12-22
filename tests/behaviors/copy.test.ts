import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { createCopyBehavior } from '../../src/behaviors';

function mockClipboard(): Mock {
    const writeText = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal('navigator', {
        clipboard: {writeText},
    } as any);

    return writeText;
}

const event = new MouseEvent('click', {
    cancelable: true,
    bubbles: true
});

event.preventDefault = vi.fn();

describe('copy behavior', () => {
    let writeText: Mock;

    beforeEach(() => {
        writeText = mockClipboard();

        document.body.innerHTML = '<a data-copy="value for copy" id="single-copy">Copy single</a>' +
            '<a data-copy="value for copy 2" data-copy-message="SUCCESS COPY" id="copy-with-message">Copy with message</a>' +
            '<a href="#" data-copy="abra" id="with-hash"></a>';
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetAllMocks();
    });

    it('success copy', async () => {
        const copyBehavior = createCopyBehavior();
        await copyBehavior(document.getElementById('single-copy')!, event);

        expect(writeText).toHaveBeenCalledOnce();
        expect(writeText).toHaveBeenCalledWith('value for copy');
        expect(event.preventDefault).not.toBeCalled();
    });

    it('should prevent default for #', async () => {
        const copyBehavior = createCopyBehavior();
        await copyBehavior(document.getElementById('with-hash')!, event);

        expect(writeText).toHaveBeenCalledOnce();
        expect(event.preventDefault).toBeCalled();
    });

    it('success copy with message', async () => {
        const cb = vi.fn();

        const copyBehavior = createCopyBehavior({success: cb});
        await copyBehavior(document.getElementById('copy-with-message')!, event);

        expect(writeText).toHaveBeenCalledOnce();
        expect(writeText).toHaveBeenCalledWith('value for copy 2');

        expect(cb).toHaveBeenCalledOnce();
        expect(cb).toHaveBeenCalledWith('SUCCESS COPY', expect.any(HTMLAnchorElement));
    });
});
