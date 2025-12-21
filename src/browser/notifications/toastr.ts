import { NotificationAdapter } from './adapter';

type ToastrModule = typeof import('toastr');

export function createToastAdapter(configurator?: (toastr: ToastrModule) => void): NotificationAdapter {
    let toastrPromise: Promise<ToastrModule> | null = null;

    const loadModule = async () => {
        if (toastrPromise) {
            return toastrPromise;
        }

        toastrPromise = import('toastr').then((module) => {
            configurator?.(module);

            return module;
        });

        return toastrPromise;
    };

    return {
        async success(message) {
            (await loadModule()).success(message);
        },
        async info(message) {
            (await loadModule()).info(message);
        },
        async warning(message) {
            (await loadModule()).warning(message);
        },
        async error(message) {
            (await loadModule()).error(message);
        },
    };
}
