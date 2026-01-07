export type WaitPropertyOptions = {
    timeout?: number;   // ms, default 5000
    interval?: number;  // ms, default 50
};

export function waitProperty<T = unknown>(obj: object, key: PropertyKey, options: WaitPropertyOptions = {}): Promise<T> {
    const {
        timeout = 5000,
        interval = 50,
    } = options;

    return new Promise((resolve, reject) => {
        const start = Date.now();

        const check = () => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                resolve((obj as any)[key] as T); // eslint-disable-line @typescript-eslint/no-explicit-any

                return;
            }

            if (Date.now() - start >= timeout) {
                reject(new Error(`Property "${String(key)}" was not defined within ${timeout}ms.`));

                return;
            }

            setTimeout(check, interval);
        };

        check();
    });
}
