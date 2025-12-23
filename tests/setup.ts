import { afterEach, beforeEach, Mock, vi } from 'vitest';

export class MockXMLHttpRequest {
    static instances: MockXMLHttpRequest[] = [];

    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    ontimeout: (() => void) | null = null;

    response: BodyInit = '';
    status = 0;

    open = vi.fn();
    send = vi.fn();
    setRequestHeader = vi.fn();
    getAllResponseHeaders = vi.fn().mockReturnValue('bla: bar');

    upload = {
        onprogress: null as ((e: ProgressEvent) => void) | null,
    };

    constructor() {
        MockXMLHttpRequest.instances.push(this);
    }

    mockReturnOk(): MockXMLHttpRequest {
        this.response = 'OK';
        this.status = 200;
        this.onload?.();

        return this;
    }

    static instance(): MockXMLHttpRequest {
        if (!MockXMLHttpRequest.instances.length) {
            throw new Error('no initiate XMLHttpRequest');
        }

        return MockXMLHttpRequest.instances[0];
    }
}

export const fetchMock: Mock = vi.fn();

beforeEach(() => {
    MockXMLHttpRequest.instances = [];

    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal(XMLHttpRequest.name, MockXMLHttpRequest as any);
});

afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.unstubAllGlobals();
});