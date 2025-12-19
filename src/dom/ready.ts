export type DomReadyCallback = () => void;

export function onDomReady(callback: DomReadyCallback): void;
export function onDomReady(callback: Array<DomReadyCallback>): void

export function onDomReady(callback: DomReadyCallback | Array<DomReadyCallback>): void {
    let wrap: DomReadyCallback;

    if (Array.isArray(callback)) {
        wrap = () => callback.forEach((c) => c.call(null));
    } else {
        wrap = callback;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wrap, {
            once: true,
        });
    } else {
        wrap.call(null);
    }
}
