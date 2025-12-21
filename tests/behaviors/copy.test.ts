import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { copyBehavior, createCopyBehavior } from '../../src/behaviors';

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
        await copyBehavior(document.getElementById('single-copy')!, event);

        expect(writeText).toHaveBeenCalledOnce();
        expect(writeText).toHaveBeenCalledWith('value for copy');
        expect(event.preventDefault).not.toBeCalled();
    });

    it('should prevent default for #', async () => {
        await copyBehavior(document.getElementById('with-hash')!, event);

        expect(writeText).toHaveBeenCalledOnce();
        expect(event.preventDefault).toBeCalled();
    });

    it('success copy with message', async () => {
        const cb = vi.fn();

        await copyBehavior(document.getElementById('copy-with-message')!, event, {
            success: cb
        });

        expect(writeText).toHaveBeenCalledOnce();
        expect(writeText).toHaveBeenCalledWith('value for copy 2');

        expect(cb).toHaveBeenCalledOnce();
        expect(cb).toHaveBeenCalledWith('SUCCESS COPY', expect.any(HTMLAnchorElement));
    });
});


describe('create copy behavior', () => {
    let writeText: Mock;

    beforeEach(() => {
        writeText = mockClipboard();

        document.body.innerHTML = '<a data-copy="value" id="single-copy">Copy</a>';
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetAllMocks();
    });

    it('success create behavior', async () => {
        const cb = vi.fn();

        const behavior = createCopyBehavior({
            success: cb
        });

        await behavior(document.getElementById('single-copy')!, event);

        expect(writeText).toHaveBeenCalledOnce();
        expect(writeText).toHaveBeenCalledWith('value');

        expect(cb).toHaveBeenCalledOnce();
        expect(cb).toHaveBeenCalledWith('Success copy to clipboard.', expect.any(HTMLAnchorElement));
    });
});