export type AppendScriptOptions = {
    type?: string;
    async?: boolean;
    defer?: boolean;
    attributes?: Record<string, string>;
};

export type AppendStyleOptions = {
    media?: string;
    attributes?: Record<string, string>;
};

export type AppendAssetOptions = | AppendScriptOptions | AppendStyleOptions;

let scriptsMap = new Map<string, Promise<HTMLScriptElement>>();
let stylesMap = new Map<string, Promise<HTMLLinkElement>>();

function findScriptByKey(key: string): HTMLScriptElement | undefined {
    const scripts = document.getElementsByTagName('script');

    return Array.from(scripts).find((e) => e.src === key);
}

function findStyleByKey(key: string): HTMLLinkElement | undefined {
    const links = document.getElementsByTagName('link');

    return Array.from(links).find((e) => e.rel === 'stylesheet' && e.href === key);
}

function getExtension(url: string): string | null {
    const clean = url.split('#')[0]!.split('?')[0]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    const idx = clean.lastIndexOf('.');

    return idx >= 0 ? clean.slice(idx + 1).toLowerCase() : null;
}

export function appendScript(src: string, options: AppendScriptOptions = {}): Promise<HTMLScriptElement> {
    const key = new URL(src, document.baseURI).href;

    const cached = scriptsMap.get(key);

    if (cached) {
        return cached;
    }

    const existing = findScriptByKey(key);

    if (existing) {
        const ready = Promise.resolve(existing);
        scriptsMap.set(key, ready);

        return ready;
    }

    const promise: Promise<HTMLScriptElement> = new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.src = src;
        script.type = options.type ?? 'text/javascript';

        if (options.async !== undefined) {
            script.async = options.async;
        }

        if (options.defer !== undefined) {
            script.defer = options.defer;
        }

        if (options.attributes) {
            Object.entries(options.attributes).forEach(([k, v]) => script.setAttribute(k, v));
        }

        const cleanup = () => {
            script.removeEventListener('load', onLoad);
            script.removeEventListener('error', onError);
        };

        const onLoad = () => {
            resolve(script);
            cleanup();
        };

        const onError = () => {
            script.remove();
            scriptsMap.delete(key);

            reject(new Error(`Failed to load script: ${src}`));

            cleanup();
        };

        script.addEventListener('load', onLoad);
        script.addEventListener('error', onError);

        document.head.appendChild(script);
    });

    scriptsMap.set(key, promise);

    return promise;
}

export function appendStyle(href: string, options: AppendStyleOptions = {}): Promise<HTMLLinkElement> {
    const key = new URL(href, document.baseURI).href;

    const cached = stylesMap.get(key);

    if (cached) {
        return cached;
    }

    const existing = findStyleByKey(key);

    if (existing) {
        const ready = Promise.resolve(existing);
        stylesMap.set(key, ready);

        return ready;
    }

    const promise = new Promise<HTMLLinkElement>((resolve, reject) => {
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.href = href;

        if (options.media) {
            link.media = options.media;
        }

        if (options.attributes) {
            Object.entries(options.attributes).forEach(([k, v]) => link.setAttribute(k, v));
        }

        const onLoad = () => {
            resolve(link);
        };

        const onError = () => {
            link.remove();
            stylesMap.delete(key);

            reject(new Error(`Failed to load stylesheet: ${href}`));
        };

        link.addEventListener('load', onLoad, { once: true });
        link.addEventListener('error', onError, { once: true });

        document.head.appendChild(link);
    });

    stylesMap.set(key, promise);

    return promise;
}

export function appendAsset(url: string, options: AppendAssetOptions = {}): Promise<HTMLScriptElement | HTMLLinkElement> {
    const ext = getExtension(url);

    if (ext === 'css') {
        return appendStyle(url, options as AppendStyleOptions);
    }

    if (ext === 'js' || ext === 'mjs') {
        return appendScript(url, options as AppendScriptOptions);
    }

    throw new Error(`Unsupported asset type for "${url}". Expected ".css", ".js" or ".mjs".`);
}

export const __test__ = import.meta.env?.MODE === 'test'
    ? {
        reset: () => {
            scriptsMap = new Map();
            stylesMap = new Map();
        },
    }
    : undefined;

