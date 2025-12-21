import { describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from '../../src/browser';

describe('copy to clipboard', () => {
    it('uses navigator.clipboard.writeText', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);

        vi.stubGlobal('navigator', {
            clipboard: {writeText},
        } as any);

        await copyToClipboard('hello');

        expect(writeText).toHaveBeenCalledOnce();
        expect(writeText).toHaveBeenCalledWith('hello');
    });
});
