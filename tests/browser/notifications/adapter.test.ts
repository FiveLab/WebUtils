import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAdapter, NotificationAdapter, registerNotificationAdapter } from '../../../src/browser/notifications/adapter';

const adapter: NotificationAdapter = {
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    error: vi.fn()
};

describe('get adapter', () => {
    beforeEach(() => {
        registerNotificationAdapter(null);
    });

    it('success', () => {
        registerNotificationAdapter(adapter);

        const result = getAdapter();

        expect(result).toStrictEqual(adapter);
    });

    it('fail if not registered', () => {
        expect(() => {
            getAdapter();
        }).toThrowError(new Error('Notification adapter is not registered. Call registerNotificationAdapter() first.'));
    })
});
