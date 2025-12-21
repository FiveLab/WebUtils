import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createToastAdapter } from '../../../src/browser/notifications/toastr';
import { NotificationAdapter } from '../../../src/browser/notifications/adapter';

const toastrMock = {
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
};

vi.mock('toastr', () => {
    return toastrMock;
});

describe('create toastr adapter', () => {
    let adapter: NotificationAdapter;

    beforeEach(() => {
        adapter = createToastAdapter();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('success', async () => {
        await adapter.success('success message');

        expect(toastrMock.success).toHaveBeenCalledOnce();
        expect(toastrMock.success).toHaveBeenCalledWith('success message');
    });

    it('info', async () => {
        await adapter.info('info message');

        expect(toastrMock.info).toHaveBeenCalledOnce();
        expect(toastrMock.info).toHaveBeenCalledWith('info message');
    });

    it('warning', async () => {
        await adapter.info('warning message');

        expect(toastrMock.info).toHaveBeenCalledOnce();
        expect(toastrMock.info).toHaveBeenCalledWith('warning message');
    });

    it('error', async () => {
        await adapter.info('error message');

        expect(toastrMock.info).toHaveBeenCalledOnce();
        expect(toastrMock.info).toHaveBeenCalledWith('error message');
    });

    it('call to configurator', async () => {
        const cb = vi.fn();
        const innerAdapter = createToastAdapter(cb);
        await innerAdapter.info('test');

        expect(cb).toHaveBeenCalledOnce();
        expect(cb).toHaveBeenCalledWith(expect.any(Object));
    })
});
