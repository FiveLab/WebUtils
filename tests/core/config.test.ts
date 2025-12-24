import { beforeEach, describe, expect, it } from 'vitest';
import { __test__, getConfig, hasConfig, setConfig } from '../../src/core/config';

describe('config', () => {
    beforeEach(() => {
        __test__?.reset();
    });

    it('returns config immediately if already set', async () => {
        setConfig('apiUrl', 'https://api.local/');

        const value = await getConfig<string>('apiUrl');

        expect(value).toBe('https://api.local/');
    });

    it('waits for config to be set later', async () => {
        const promise = getConfig<string>('featureFlag');

        setTimeout(() => {
            setConfig('featureFlag', 'enabled');
        }, 10);

        const value = await promise;

        expect(value).toBe('enabled');
    });

    it('throws on timeout if config is not set', async () => {
        await expect(
            getConfig('missing', 20)
        ).rejects.toThrow(new Error('Failed to read config "missing" during timeout (20ms).'));
    });

    it('resolves falsy values correctly', async () => {
        setConfig('flagFalse', false);
        setConfig('zero', 0);
        setConfig('empty', '');

        expect(await getConfig<boolean>('flagFalse')).toBe(false);
        expect(await getConfig<number>('zero')).toBe(0);
        expect(await getConfig<string>('empty')).toBe('');
    });

    it('hasConfig reflects presence of key', () => {
        expect(hasConfig('a')).toBe(false);

        setConfig('a', 123);

        expect(hasConfig('a')).toBe(true);
    });

    it('multiple waiters resolve when config is set', async () => {
        const p1 = getConfig<string>('shared');
        const p2 = getConfig<string>('shared');

        setTimeout(() => {
            setConfig('shared', 'ok');
        }, 5);

        const [v1, v2] = await Promise.all([p1, p2]);

        expect(v1).toBe('ok');
        expect(v2).toBe('ok');
    });
});
