import { onDomReady } from './dom-ready';

export type EventHandler = (element: Element, event: Event) => void;
export type EventHandlers = Record<string, EventHandler>;

type EventName = 'click' | 'change';
type Selector = string;

type BaseListenOptions = {
    readonly target?: string | HTMLElement;
}

type SelectorListenOptions = BaseListenOptions & {
    readonly selector: Selector;
    selectors?: never;
}

type SelectorsListenOptions = BaseListenOptions & {
    readonly selectors: EventHandlers;
    selector?: never;
}

export function onDomEvents(eventName: EventName, options: SelectorListenOptions | string, handler: EventHandler): void;
export function onDomEvents(eventName: EventName, options: SelectorsListenOptions): void;

export function onDomEvents(eventName: EventName, options: SelectorListenOptions | SelectorsListenOptions | string, handler?: EventHandler): void {
    if (typeof options === 'string') {
        options = <SelectorListenOptions>{
            selector: options
        }
    }

    if (options.selectors && handler) {
        throw new Error('Only one option must be provided: either selectors or callback, not both.');
    }

    let selectors: EventHandlers;

    if (options.selectors) {
        selectors = options.selectors;
    } else {
        if (!handler) {
            throw new Error('Missed handler');
        }

        selectors = {};
        selectors[options.selector] = handler;
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
    }

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
