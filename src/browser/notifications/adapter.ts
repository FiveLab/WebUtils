export type NotificationAdapter = {
    success(message: string): Promise<void>;
    error(message: string): Promise<void>;
    info(message: string): Promise<void>;
    warning(message: string): Promise<void>;
};

let adapter: NotificationAdapter | null = null;

export function registerNotificationAdapter(value: NotificationAdapter | null): void {
    adapter = value;
}

export function getAdapter(): NotificationAdapter {
    if (!adapter) {
        throw new Error('Notification adapter is not registered. Call registerNotificationAdapter() first.');
    }

    return adapter;
}
