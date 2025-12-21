import { afterEach, describe, expect, it, Mock, vi } from 'vitest';
import { getAdapter } from '../../src/browser/notifications/adapter';
import { notifyByResponse, notifyError, notifyFetchError, notifyInfo, notifySuccess, notifyWarning } from '../../src/browser';

const createAdapter = () => {
    const success = vi.fn().mockResolvedValue(undefined);
    const info = vi.fn().mockResolvedValue(undefined);
    const warning = vi.fn().mockResolvedValue(undefined);
    const error = vi.fn().mockResolvedValue(undefined);

    (getAdapter as unknown as Mock).mockReturnValue({
        success,
        info,
        warning,
        error,
    });

    return {
        getAdapter,
        success,
        info,
        warning,
        error
    }
};

vi.mock('../../src/browser/notifications/adapter', () => {
    return {
        getAdapter: vi.fn(),
    };
});

afterEach(() => {
    vi.resetAllMocks();
});

describe('notify success', () => {
    it('notify', async () => {
        const {getAdapter, success} = createAdapter();

        await notifySuccess('some text');

        expect(getAdapter).toHaveBeenCalledOnce();
        expect(success).toHaveBeenCalledOnce();
        expect(success).toHaveBeenCalledWith('some text');
    });
});

describe('notify info', () => {
    it('notify', async () => {
        const {getAdapter, info} = createAdapter();

        await notifyInfo('some foo');

        expect(getAdapter).toHaveBeenCalledOnce();
        expect(info).toHaveBeenCalledOnce();
        expect(info).toHaveBeenCalledWith('some foo');
    });
});

describe('notify warning', () => {
    it('notify', async () => {
        const {getAdapter, warning} = createAdapter();

        await notifyWarning('some bar');

        expect(getAdapter).toHaveBeenCalledOnce();
        expect(warning).toHaveBeenCalledOnce();
        expect(warning).toHaveBeenCalledWith('some bar');
    });
});

describe('notify error', () => {
    it('notify', async () => {
        const {getAdapter, error} = createAdapter();

        await notifyError('some error');

        expect(getAdapter).toHaveBeenCalledOnce();
        expect(error).toHaveBeenCalledOnce();
        expect(error).toHaveBeenCalledWith('some error');
    });
});

describe('notify fetch error', () => {
    it('notify', async () => {
        const {getAdapter, error} = createAdapter();

        await notifyFetchError();

        expect(getAdapter).toHaveBeenCalledOnce();
        expect(error).toHaveBeenCalledOnce();
        expect(error).toHaveBeenCalledWith('Network error: unable to fetch the API request.');
    });
});

describe('notify by response', () => {
    it.each([
        [200],
        [201],
        [204]
    ])('success status - %d', async (status) => {
        const {getAdapter, success} = createAdapter();

        await notifyByResponse(new Response(null, {status: status}), 'some foo bar');

        expect(getAdapter).toHaveBeenCalledOnce();
        expect(success).toHaveBeenCalledWith('some foo bar');
    });

    it('success without text', async () => {
        const {getAdapter, success} = createAdapter();

        await notifyByResponse(new Response(null, {status: 200}));

        expect(getAdapter).not.toBeCalled();
        expect(success).not.toBeCalled();
    });

    it('wrong status', async () => {
        const {getAdapter, error} = createAdapter();

        await notifyByResponse(new Response(null, {status: 500, statusText: 'Internal Server Error'}));

        expect(getAdapter).toHaveBeenCalledOnce();
        expect(error).toHaveBeenCalledWith('Receive wrong status - Internal Server Error');
    });
});
