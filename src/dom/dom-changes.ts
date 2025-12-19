import { onDomReady } from './dom-ready';

type BaseDomChangeOptions = MutationObserverInit & {
    readonly onDomReady?: boolean; // execute handler after dom ready?
    readonly target?: string; // where we must see changes?
}

type SelectorDomChangeOptions = BaseDomChangeOptions & {
    readonly selector?: string; // what element we find?
    selectors?: never;
}

type SelectorsDomChangeOptions = BaseDomChangeOptions & {
    readonly selectors?: DomChangeCallbacks; // each selector must contain callback function
    selector?: never;
}

type DomChangeOptions = SelectorsDomChangeOptions | SelectorDomChangeOptions;

export type DomChangeCallback = (target: Element, item?: MutationRecord) => void;
export type DomChangeCallbacks = Record<string, DomChangeCallback>;

export function onDomChanges(options: SelectorDomChangeOptions, callback: DomChangeCallback): void;
export function onDomChanges(options: SelectorsDomChangeOptions): void;

export function onDomChanges(options: DomChangeOptions, callback?: DomChangeCallback): void {
    if (options.selector && options.selectors) {
        throw new Error('Only one option must be provided: either selector or selectors, not both.');
    }

    if (options.selectors && callback) {
        throw new Error('Only one option must be provided: either selectors or callback, not both.');
    }

    function changesOnElementWithSelector(element: HTMLElement, handler: DomChangeCallback, item?: MutationRecord, selector?: string): void {
        if (selector) {
            if (element.matches(selector)) {
                handler.call(null, element, item);
            } else {
                element.querySelectorAll(selector).forEach((innerElement) => {
                    handler.call(null, innerElement, item);
                });
            }
        } else {
            handler.call(null, element, item);
        }
    }

    function changesOnElementWithSelectors(element: HTMLElement, selectors: DomChangeCallbacks, item?: MutationRecord): void {
        Object.entries(selectors).forEach(([selector, handler]) => {
            changesOnElementWithSelector.call(null, element, handler, item, selector);
        });
    }

    let selectors: DomChangeCallbacks | undefined = undefined;

    if (options.selectors) {
        selectors = options.selectors;
    } else if (options.selector) {
        if (!callback) {
            throw new Error('Missed callback.');
        }

        selectors = {};
        selectors[options.selector] = callback;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((item) => {
            item.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) {
                    return;
                }

                if (selectors) {
                    changesOnElementWithSelectors(node, selectors, item);
                } else {
                    if (!callback) {
                        throw new Error('Missed callback.');
                    }

                    changesOnElementWithSelector(node, callback, item);
                }
            });

            if (item.attributeName) {
                callback?.call(null, <Element>item.target, item);
            }
        });
    });

    onDomReady(() => {
        const target = <HTMLElement>(options.target ? document.querySelector(options.target) : document.body);

        if (!target) {
            console.debug(`The target with selector "${options.target}" for listen page changes was not found.`);

            return;
        }

        observer.observe(target, options);

        if (options.onDomReady) {
            if (!selectors) {
                throw new Error('Selector or selectors is required for enable "on dom ready".');
            }

            changesOnElementWithSelectors(target, selectors);
        }
    });
}
