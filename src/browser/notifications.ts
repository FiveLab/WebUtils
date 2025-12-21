import { getAdapter } from './notifications/adapter';
export { registerNotificationAdapter } from './notifications/adapter';

export async function notifySuccess(message: string) {
    await getAdapter().success(message);
}

export async function notifyError(message: string) {
    await getAdapter().error(message);
}

export async function notifyInfo(message: string) {
    await getAdapter().info(message);
}

export async function notifyWarning(message: string) {
    await getAdapter().warning(message);
}
