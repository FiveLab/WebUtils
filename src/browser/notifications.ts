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

export async function notifyFetchError() {
    await getAdapter().error('Network error: unable to fetch the API request.');
}

export async function notifyByResponse(response: Response): Promise<void>;
export async function notifyByResponse(response: Response, message: string): Promise<void>

export async function notifyByResponse(response: Response, message?: string) {
    if ([200, 201, 204].includes(response.status)) {
        if (message) {
            await notifySuccess(message);
        }
    } else {
        await notifyError(`Receive wrong status - ${response.statusText}`);
    }
}
