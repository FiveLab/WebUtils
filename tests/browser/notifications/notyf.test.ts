import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationAdapter } from '../../../src/browser/notifications/adapter';
import { createNotyfAdapter } from '../../../src/browser/notifications/notyf';

const notyfInstanceMock = {
    success: vi.fn(),
    error: vi.fn(),
    open: vi.fn(),
};

class NotyfMock {
    constructor() {
        return notyfInstanceMock;
    }
}

vi.mock('notyf', () => ({
    Notyf: NotyfMock,
}));

describe('create notyf adapter', () => {
    let adapter: NotificationAdapter;

    beforeEach(() => {
        adapter = createNotyfAdapter();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('success', async () => {
        await adapter.success('success message');

        expect(notyfInstanceMock.success).toHaveBeenCalledOnce();
        expect(notyfInstanceMock.success).toHaveBeenCalledWith('success message');
    });

    it('info', async () => {
        await adapter.info('info message');

        expect(notyfInstanceMock.open).toHaveBeenCalledOnce();
        expect(notyfInstanceMock.open).toHaveBeenCalledWith({type: 'info', message: 'info message'});
    });

    it('warning', async () => {
        await adapter.warning('warning message');

        expect(notyfInstanceMock.open).toHaveBeenCalledOnce();
        expect(notyfInstanceMock.open).toHaveBeenCalledWith({type: 'warning', message: 'warning message'});
    });

    it('error', async () => {
        await adapter.error('error message');

        expect(notyfInstanceMock.error).toHaveBeenCalledOnce();
        expect(notyfInstanceMock.error).toHaveBeenCalledWith('error message');
    })
});