import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { __test__, configureSentry, handleError, loadSentry } from '../../../src/observability';

vi.mock('@sentry/browser', () => {
    const setTags = vi.fn();

    const scopeMock = {setTags};

    const init = vi.fn((options: any) => {
        const initialScope = options?.initialScope;

        if (typeof initialScope === 'function') {
            initialScope(scopeMock);
        }
    });

    const captureException = vi.fn();

    return {
        init,
        captureException,
        breadcrumbsIntegration: vi.fn(),
        dedupeIntegration: vi.fn(),
        __mocks: {init, captureException, setTags},
    };
});

import * as sentry from '@sentry/browser';

const mocks = (sentry as any).__mocks;

describe('configure sentry', () => {
    beforeEach(() => {
        __test__?.reset();
    });

    it('success simple configure', () => {
        configureSentry('dsn', 'https://sentry.org/project/123');
        configureSentry('environment', 'develop');
        configureSentry('tags', {foo: 'bar', bar: 'value'});

        expect(__test__?.getOptions()).toStrictEqual({
            dsn: 'https://sentry.org/project/123',
            environment: 'develop',
            tags: {foo: 'bar', bar: 'value'}
        });
    });

    it('success add configurations to object', () => {
        configureSentry('tags', {foo: 'bar'});
        configureSentry('tags', {bar: 'value'});

        expect(__test__?.getOptions()).toStrictEqual({
            tags: {foo: 'bar', bar: 'value'}
        });
    });

    it('success add configurations to array', () => {
        configureSentry('integrations', [sentry.breadcrumbsIntegration]);
        configureSentry('integrations', [sentry.dedupeIntegration])

        expect(__test__?.getOptions()).toStrictEqual({
            integrations: [sentry.breadcrumbsIntegration, sentry.dedupeIntegration]
        });
    });
});

describe('load sentry', () => {
    beforeEach(() => {
        __test__?.reset();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('success load', async () => {
        configureSentry('dsn', 'https://sentry.org');

        const module = await loadSentry();

        expect(mocks.init).toHaveBeenCalledOnce();
        expect(mocks.init).toHaveBeenCalledWith({
            dsn: 'https://sentry.org',
            initialScope: expect.any(Function)
        });

        expect(module).toHaveProperty('init');
    });
});

describe('handle error', () => {
    it('success handle', async () => {
        const error = new Error('bla bla');

        await handleError(error);

        expect(mocks.captureException).toHaveBeenCalledOnce();
        expect(mocks.captureException).toHaveBeenCalledWith(error);
    });
});
