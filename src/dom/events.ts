import { onDomReady } from './ready';

export type EventHandler<E extends Element = Element> = (element: E, event: Event) => void;
export type EventHandlers<E extends Element = Element> = Record<string, EventHandler<E>>;

type EventName = 'click' | 'change';
type Selector = string;

type BaseListenOptions = {
    readonly target?: string | HTMLElement;
}

type SelectorListenOptions = BaseListenOptions & {
    readonly selector: Selector;
    selectors?: never;
}

type SelectorsListenOptions<E extends Element = Element> = BaseListenOptions & {
    readonly selectors: EventHandlers<E>;
    selector?: never;
}

export function onDomEvents<E extends Element = Element>(eventName: EventName, options: SelectorListenOptions | string, handler: EventHandler<E>): void;
export function onDomEvents<E extends Element = Element>(eventName: EventName, options: SelectorsListenOptions<E>): void;

export function onDomEvents<E extends Element = Element>(eventName: EventName, options: SelectorListenOptions | SelectorsListenOptions<E> | string, handler?: EventHandler<E>): void {
    if (typeof options === 'string') {
        options = <SelectorListenOptions>{
            selector: options,
        };
    }

    if (options.selectors && handler) {
        throw new Error('Only one option must be provided: either selectors or callback, not both.');
    }

    let selectors: EventHandlers;

    if (options.selectors) {
        selectors = options.selectors as EventHandlers;
    } else {
        if (!handler) {
            throw new Error('Missed handler');
        }

        selectors = {};
        selectors[options.selector] = handler as EventHandler;
    }

    const findHandler = (selectors: EventHandlers, element: HTMLElement): [HTMLElement, EventHandler] | null => {
        for (const [selector, handler] of Object.entries(selectors)) {
            if (element.matches(selector)) {
                return [element, handler];
            }

            const parent = <HTMLElement>element.closest(selector);

            if (parent) {
                return [parent, handler];
            }
        }

        return null;
    };

    onDomReady(() => {
        let target: Element | null = document.body;

        if (options.target) {
            target = options.target instanceof Element ? options.target : document.querySelector(options.target);

            if (!target) {
                throw new Error(`Missed target element by selector "${options.target}".`);
            }
        }

        target.addEventListener(eventName, (event): void => {
            const target = <HTMLElement>event.target;
            const entry = findHandler(selectors, target);

            if (entry) {
                entry[1].call(null, entry[0], event);
            }
        });
    });
}
