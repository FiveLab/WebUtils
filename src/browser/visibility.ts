export type ElementVisibilityCallback<T extends Element = Element> = (element: T, visible: boolean) => void;

type ObserverEntry = {
    callback: ElementVisibilityCallback;
    once: boolean;
};

type ObserveVisibilityOptions = {
    readonly once?: boolean;
}

const observers = new Map<Element, ObserverEntry>();

const intersectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        const observer = observers.get(entry.target);

        if (!observer) {
            continue;
        }

        observer.callback(entry.target, entry.isIntersecting);

        if (observer.once && entry.isIntersecting) {
            intersectionObserver.unobserve(entry.target);
            observers.delete(entry.target);
        }
    }
});

export function observeElementVisibility<T extends Element = Element>(element: T, callback: ElementVisibilityCallback<T>, options?: ObserveVisibilityOptions): () => void {
    observers.set(element, {
        callback: callback as ElementVisibilityCallback,
        once: options?.once ?? false,
    });

    intersectionObserver.observe(element);

    return () => {
        intersectionObserver.unobserve(element);
        observers.delete(element);
    };
}
