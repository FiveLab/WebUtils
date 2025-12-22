import { BrowserOptions } from '@sentry/browser';
import { existsEmbeddedData, readEmbeddedData } from '../../dom/embedded-data';

export * from './integrations';

type SentryOptions = BrowserOptions & {
    tags?: Record<string, string>;
}

type SentryEmbeddedConfig = Readonly<Pick<SentryOptions, 'dsn' | 'environment' | 'release' | 'tags'>>;

let loadSentryPromise: Promise<typeof import('@sentry/browser')> | null = null;
let sentryInitOptions: SentryOptions = {};

export function configureSentry<K extends keyof SentryOptions>(key: K, value: SentryOptions[K], overwrite: boolean = true): void {
    if (key in sentryInitOptions) {
        if (!overwrite) {
            // Disable overwrite. Ignore.
            return;
        }

        const activeValue = sentryInitOptions[key];

        if (Array.isArray(value)) {
            value = <SentryOptions[K]>[
                ...(Array.isArray(activeValue) ? activeValue : []),
                ...value,
            ];
        } else if (typeof value === 'object') {
            value = <SentryOptions[K]>{
                ...(typeof activeValue === 'object' ? activeValue : {}),
                ...value,
            };
        }
    }

    sentryInitOptions[key] = value;
}

export async function loadSentry() {
    if (loadSentryPromise) {
        return loadSentryPromise;
    }

    if (existsEmbeddedData('sentry')) {
        const config = readEmbeddedData<SentryEmbeddedConfig>('sentry');

        configureSentry('dsn', config.dsn || '', false);
        configureSentry('environment', config.environment || '', false);
        configureSentry('release', config.release || '', false);
        configureSentry('tags', typeof config.tags === 'object' && null !== config.tags ? config.tags : {});
    }

    loadSentryPromise = import('@sentry/browser').then((module) => {
        module.init({
            ...sentryInitOptions,
            initialScope: (scope) => {
                if (sentryInitOptions.tags) {
                    scope.setTags(sentryInitOptions.tags);
                }

                return scope;
            },
        });

        return module;
    });

    return loadSentryPromise;
}

export function listenGlobalErrors(): void {
    window.addEventListener('error', async (event) => {
        const error = event.error ?? new Error(event.message ?? 'Unknown error');

        await handleError(error);
    });

    window.addEventListener('unhandledrejection', async (event) => {
        const reason = event.reason instanceof Error
            ? event.reason
            : new Error(typeof event.reason === 'string' ? event.reason : JSON.stringify(event.reason));

        await handleError(reason);
    });
}

export async function handleError(error: unknown): Promise<void> {
    (await loadSentry()).captureException(error);
}

export function registerDebugHandler(): void {
    const handler = () => {
        throw new Error('test sentry error');
    };

    Object.defineProperty(window, 'testSentry', {
        set: (enabled: boolean) => {
            console.debug(`${enabled ? 'Enable' : 'Disable'} testing sentry for trigger error on click.`);

            if (enabled) {
                document.addEventListener('click', handler);
            } else {
                document.removeEventListener('click', handler);
            }
        },
    });
}

export const __test__ = import.meta.env?.MODE === 'test'
    ? {
        getOptions: () => sentryInitOptions,
        reset: () => {
            sentryInitOptions = {};
        },
    }
    : undefined;