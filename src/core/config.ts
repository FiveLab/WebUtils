let store: Map<string, unknown> = new Map();
let waiters: Map<string, [Promise<unknown>, (value: unknown) => void]> = new Map();

export function setConfig(key: string, value: unknown): void {
    store.set(key, value);

    const waiterEntry = waiters.get(key);

    if (waiterEntry) {
        waiterEntry[1](value);
        waiters.delete(key);
    }
}

export async function getConfig<T = unknown>(key: string, timeout = 1000): Promise<T> {
    if (store.has(key)) {
        return store.get(key) as T;
    }

    const existence = waiters.get(key);

    if (existence) {
        return existence[0] as T;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

    let wrappedResolve!: (value: unknown) => void;

    const promise = new Promise<T>((resolve, reject) => {
        timer = setTimeout(() => {
            waiters.delete(key);
            reject(new Error(`Failed to read config "${key}" during timeout (${timeout}ms).`));
        }, timeout);

        wrappedResolve = (value: unknown) => {
            clearTimeout(timer);
            resolve(value as T);
        };
    });

    waiters.set(key, [promise as Promise<unknown>, wrappedResolve]);

    return promise;
}

export function hasConfig(key: string): boolean {
    return store.has(key);
}

export const __test__ = import.meta.env?.MODE === 'test'
    ? {
        reset: () => {
            store = new Map();
            waiters = new Map();
        },
    }
    : undefined;
