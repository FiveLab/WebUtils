import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { __test__, appendAsset, appendScript, appendStyle } from '../../src/browser';

afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
});

beforeEach(() => {
    __test__?.reset();
});

describe('append script', () => {
    it('appends <script> and resolves on load', async () => {
        const p = appendScript('/some.js');

        const script = document.head.querySelector('script') as HTMLScriptElement | null;
        expect(script).not.toBeNull();
        expect(script!.src).toBe(new URL('/some.js', document.baseURI).href);

        script!.dispatchEvent(new Event('load'));

        await expect(p).resolves.toBe(script);
    });

    it('dedupes same src: returns same promise and does not append twice', async () => {
        const p1 = appendScript('/dup.js');
        const p2 = appendScript('/dup.js');

        expect(p1).toStrictEqual(p2);
        expect(document.head.querySelectorAll('script').length).toBe(1);

        const script = document.head.querySelector('script')!;
        script.dispatchEvent(new Event('load'));

        await expect(p1).resolves.toBe(script);
        await expect(p2).resolves.toBe(script);
    });

    it('resolves immediately if script already exists in DOM', async () => {
        const existing = document.createElement('script');
        existing.src = new URL('/pre.js', document.baseURI).href;
        document.head.appendChild(existing);

        await expect(appendScript('/pre.js')).resolves.toBe(existing);
        expect(document.head.querySelectorAll('script').length).toBe(1);
    });

    it('rejects on error and allows retry (cache cleared on reject)', async () => {
        const p1 = appendScript('/bad.js');
        const script1 = document.head.querySelector('script')!;
        script1.dispatchEvent(new Event('error'));

        await expect(p1).rejects.toThrow('Failed to load script: /bad.js');

        const p2 = appendScript('/bad.js');

        const scripts = document.head.querySelectorAll('script');
        expect(scripts.length).toBe(1);

        const script2 = scripts[0] as HTMLScriptElement;
        script2.dispatchEvent(new Event('load'));

        await expect(p2).resolves.toBe(script2);
    });

    it('applies async/defer/type and attributes', async () => {
        const p = appendScript('/attrs.js', {
            type: 'module',
            async: true,
            defer: true,
            attributes: {
                'data-foo': 'bar',
            },
        });

        const script = document.head.querySelector('script')!;

        expect(script.type).toBe('module');
        expect(script.async).toBe(true);
        expect(script.defer).toBe(true);
        expect(script.getAttribute('data-foo')).toBe('bar');

        script.dispatchEvent(new Event('load'));

        await expect(p).resolves.toBe(script);
    });
});

describe('append style', () => {
    it('appends <link rel="stylesheet"> and resolves on load', async () => {
        const p = appendStyle('/app.css');

        const link = document.head.querySelector('link[rel="stylesheet"]') as HTMLLinkElement | null;
        expect(link).not.toBeNull();
        expect(link!.href).toBe(new URL('/app.css', document.baseURI).href);

        link!.dispatchEvent(new Event('load'));

        await expect(p).resolves.toBe(link);
    });

    it('dedupes same href: does not append twice', async () => {
        const p1 = appendStyle('/dup.css');
        const p2 = appendStyle('/dup.css');

        expect(document.head.querySelectorAll('link[rel="stylesheet"]').length).toBe(1);

        const link = document.head.querySelector('link[rel="stylesheet"]') as HTMLLinkElement;
        link.dispatchEvent(new Event('load'));

        const [v1, v2] = await Promise.all([p1, p2]);

        expect(v1).toBe(link);
        expect(v2).toBe(link);
    });

    it('resolves immediately if stylesheet already exists in DOM', async () => {
        const existing = document.createElement('link');
        existing.rel = 'stylesheet';
        existing.href = new URL('/pre.css', document.baseURI).href;

        document.head.appendChild(existing);

        await expect(appendStyle('/pre.css')).resolves.toBe(existing);
        expect(document.head.querySelectorAll('link[rel="stylesheet"]').length).toBe(1);
    });

    it('rejects on error and allows retry', async () => {
        const p1 = appendStyle('/bad.css');
        const l1 = document.head.querySelector('link[rel="stylesheet"]') as HTMLLinkElement;
        l1.dispatchEvent(new Event('error'));

        await expect(p1).rejects.toThrow('Failed to load stylesheet: /bad.css');

        expect(document.head.querySelectorAll('link[rel="stylesheet"]').length).toBe(0);

        const p2 = appendStyle('/bad.css');
        const l2 = document.head.querySelector('link[rel="stylesheet"]') as HTMLLinkElement;
        expect(l2).not.toBe(l1);

        l2.dispatchEvent(new Event('load'));
        await expect(p2).resolves.toBe(l2);
    });

    it('applies media and attributes', async () => {
        const p = appendStyle('/print.css', {
            media: 'print',
            attributes: {'data-foo': 'bar'},
        });

        const link = document.head.querySelector('link[rel="stylesheet"]') as HTMLLinkElement;
        expect(link.media).toBe('print');
        expect(link.getAttribute('data-foo')).toBe('bar');

        link.dispatchEvent(new Event('load'));
        await expect(p).resolves.toBe(link);
    });
});

describe('append assets', () => {
    it('appends "link" for .css and resolves on load', async () => {
        const p = appendAsset('/app.css');

        const link = document.head.querySelector('link[rel="stylesheet"]') as HTMLLinkElement | null;
        expect(link).not.toBeNull();
        expect(link!.href).toBe(new URL('/app.css', document.baseURI).href);

        link!.dispatchEvent(new Event('load'));

        await expect(p).resolves.toBe(link);
    });

    it('appends "script" for .js and resolves on load', async () => {
        const p = appendAsset('/app.js');

        const script = document.head.querySelector('script') as HTMLScriptElement | null;
        expect(script).not.toBeNull();
        expect(script!.src).toBe(new URL('/app.js', document.baseURI).href);

        script!.dispatchEvent(new Event('load'));

        await expect(p).resolves.toBe(script);
    });

    it('rejects for unsupported extension', async () => {
        expect(() => {
            appendAsset('/file.txt');
        }).toThrow('Unsupported asset type for "/file.txt". Expected ".css", ".js" or ".mjs".');
    });
});