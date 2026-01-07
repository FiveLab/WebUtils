type AttributeValue = string | number | boolean | null | undefined;

type ContentOptions =
    | { text?: string; html?: never }
    | { html?: string; text?: never }
    | { text?: undefined; html?: undefined };

export type CommonOptions = {
    id?: string;
    dataset?: Record<string, AttributeValue>;
    attrs?: Record<string, AttributeValue>;
};

export type BaseOptions = CommonOptions & {
    classList?: string[];
    style?: Partial<CSSStyleDeclaration>;
} & ContentOptions;

export type AnchorOptions = BaseOptions & {
    href?: URL | string;
    target?: '_blank' | '_self' | '_parent' | '_top' | (string & {});
}

export type ScriptOptions = CommonOptions & {
    src?: URL | string;
    type?: 'module' | 'importmap' | 'text/javascript' | (string & {});
    async?: boolean;
    defer?: boolean;
};

export type LinkOptions = CommonOptions & {
    as?: string;
    rel?: 'stylesheet' | (string & {});
    href?: URL | string;
    type?: string;
    media?: string;
    title?: string;
}

type TagsWithCustomOptions = 'a' | 'script' | 'link';

function normalizeAttributeValue(value: AttributeValue, dataset = false): string | null {
    if (typeof value === 'undefined' || null === value) {
        return null;
    }

    if (typeof value === 'boolean') {
        return value ? (dataset ? 'true' : '1') : (dataset ? 'false' : '0');
    }

    return String(value);
}

function applyAnchorOptions(el: HTMLAnchorElement, options: AnchorOptions): void {
    if (options.href !== undefined) {
        el.href = options.href instanceof URL ? options.href.href : options.href;
    }

    if (options.target !== undefined) {
        el.target = options.target;
    }
}

function applyScriptOptions(el: HTMLScriptElement, options: ScriptOptions): void {
    if (options.src) {
        el.src = options.src instanceof URL ? options.src.href : options.src;
    }

    if (options.type !== undefined) {
        el.type = options.type;
    }

    if (options.async !== undefined) {
        el.async = options.async;
    }

    if (options.defer !== undefined) {
        el.defer = options.defer;
    }
}

function applyLinkOptions(el: HTMLLinkElement, options: LinkOptions): void {
    if (options.as !== undefined) {
        el.as = options.as;
    }

    if (options.rel !== undefined) {
        el.rel = options.rel;
    }

    if (options.href !== undefined) {
        el.href = options.href instanceof URL ? options.href.href : options.href;
    }

    if (options.type !== undefined) {
        el.type = options.type;
    }

    if (options.media !== undefined) {
        el.media = options.media;
    }

    if (options.title !== undefined) {
        el.title = options.title;
    }
}

export function createElement(tag: 'a', options: AnchorOptions): HTMLAnchorElement;
export function createElement(tag: 'script', options: ScriptOptions): HTMLScriptElement;
export function createElement(tag: 'link', options: LinkOptions): HTMLLinkElement;
export function createElement<K extends Exclude<keyof HTMLElementTagNameMap, TagsWithCustomOptions>>(tag: K, options?: BaseOptions): HTMLElementTagNameMap[K];

export function createElement(tag: string, options: BaseOptions = {}): HTMLElement {
    const el = document.createElement(tag);

    if (options.id) {
        el.id = options.id;
    }

    if (options.classList && options.classList.length) {
        el.classList.add(...options.classList);
    }

    if (options.dataset) {
        Object.entries(options.dataset).forEach(([k, v]) => {
            v = normalizeAttributeValue(v, true);

            if (null !== v) {
                (el.dataset)[k] = v;
            }
        });
    }

    if (options.attrs) {
        Object.entries(options.attrs).forEach(([k, v]) => {
            v = normalizeAttributeValue(v, false);

            if (null !== v) {
                el.setAttribute(k, v);
            }
        });
    }

    if (options.text !== undefined) {
        el.textContent = options.text;
    }

    if (options.html !== undefined) {
        el.innerHTML = options.html;
    }

    if (options.style) {
        Object.assign(el.style, options.style);
    }

    if ('a' === tag) {
        applyAnchorOptions(el as HTMLAnchorElement, options as AnchorOptions);
    }

    if ('script' === tag) {
        applyScriptOptions(el as HTMLScriptElement, options as ScriptOptions);
    }

    if ('link' === tag) {
        applyLinkOptions(el as HTMLLinkElement, options as LinkOptions);
    }

    return el;
}
