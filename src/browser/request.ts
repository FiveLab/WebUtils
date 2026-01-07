type ProgressInfoEvent = {
    readonly loaded: number;
    readonly total: number;
    readonly progress: number;
}

export type UploadProgressCallback = (progress: ProgressInfoEvent) => void;

export type UploadRequestInit = Omit<RequestInit, 'body'> & {
    readonly body: FormData;
    readonly uploadProgress?: UploadProgressCallback;
}

function isUploadRequestInit(init?: RequestInit): init is UploadRequestInit {
    return typeof init === 'object'
        && init !== null
        && 'uploadProgress' in init
        && typeof (init as UploadRequestInit).uploadProgress === 'function';
}

function xhrRequest(url: string, init: UploadRequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(init.method ?? 'POST', url, true);

        // Add headers
        if (init.headers) {
            Object.entries(init.headers).forEach(([name, value]) => xhr.setRequestHeader(name, value));
        }

        // Add pass credentials
        if (init.credentials) {
            xhr.withCredentials = true;
        }

        // Add abort signal
        const signal = init.signal;
        const onAbort = () => {
            xhr.abort();

            reject(new DOMException('Aborted', 'AbortError'));
        };

        if (signal) {
            if (signal.aborted) {
                return onAbort();
            }

            signal.addEventListener('abort', onAbort, {
                once: true,
            });
        }

        xhr.upload.onprogress = (e) => {
            if (!e.lengthComputable) {
                return;
            }

            init.uploadProgress?.({
                loaded: e.loaded,
                total: e.total,
                progress: Math.round((e.loaded / e.total) * 100),
            });
        };

        xhr.onerror = () => {
            reject(new Error('XHR network error'));
        };

        xhr.ontimeout = () => {
            reject(new Error('XHR timeout error'));
        };

        xhr.onload = () => {
            resolve(new Response(xhr.response, {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseXhrHeaders(xhr.getAllResponseHeaders()),
            }));
        };

        xhr.responseType = 'arraybuffer';
        xhr.send(init.body);
    });
}

function parseXhrHeaders(raw: string): Headers {
    const headers = new Headers();

    raw.trim().split(/[\r\n]+/).forEach((line) => {
        const idx = line.indexOf(':');

        if (idx > 0) {
            headers.append(line.slice(0, idx).trim(), line.slice(idx + 1).trim());
        }
    });

    return headers;
}

export function request(url: URL | string): Promise<Response>;
export function request(url: URL | string, init?: RequestInit): Promise<Response>;
export function request(url: URL | string, init: UploadRequestInit): Promise<Response>;

export function request(url: URL | string, init?: unknown): Promise<Response> {
    if (url instanceof URL) {
        url = url.href;
    }

    if (init && isUploadRequestInit(init)) {
        return xhrRequest(url, init);
    }

    return fetch(url, init as RequestInit | undefined);
}
