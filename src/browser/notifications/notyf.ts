import { NotificationAdapter } from './adapter';

export function createNotyfAdapter(configurator?: (notyf: import('notyf').Notyf) => void): NotificationAdapter {
    let notyfPromise: Promise<import('notyf').Notyf> | null = null;

    const loadNotyf = async () => {
        if (notyfPromise) {
            return notyfPromise;
        }

        notyfPromise = import('notyf').then((module) => {
            const instance = new module.Notyf({
                types: [
                    {
                        type: 'warning',
                        background: '#f59e0b',
                        icon: '<svg viewBox="0 0 24 24"\n' +
                            'width="24"\n' +
                            'height="24"\n' +
                            'fill="currentColor"\n' +
                            'aria-hidden="true">\n' +
                            '<path d="M12 2L1 21h22L12 2zm1 16h-2v-2h2v2zm0-4h-2v-4h2v4z"/>\n' +
                            '/svg>',
                    },

                    {
                        type: 'info',
                        background: '#3b82f6',
                        icon: '<svg\n' +
                            'viewBox="0 0 24 24"\n' +
                            'width="24"\n' +
                            'height="24"\n' +
                            'fill="currentColor"\n' +
                            'aria-hidden="true"\n' +
                            '>\n' +
                            '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>\n' +
                            '</svg>',
                    },
                ],
            });

            configurator?.(instance);

            return instance;
        });

        return notyfPromise;
    };

    return {
        async success(message) {
            (await loadNotyf()).success(message);
        },
        async info(message) {
            (await loadNotyf()).open({
                type: 'info',
                message: message,
            });
        },
        async warning(message) {
            (await loadNotyf()).open({
                type: 'warning',
                message: message,
            });
        },
        async error(message) {
            (await loadNotyf()).error(message);
        },
    };
}