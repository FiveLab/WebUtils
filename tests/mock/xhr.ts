import { beforeEach, vi } from 'vitest';

export class XMLHttpRequestMock {
    static instances: XMLHttpRequestMock[] = [];

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
        XMLHttpRequestMock.instances.push(this);
    }

    mockReturnOk(): XMLHttpRequestMock {
        this.response = 'OK';
        this.status = 200;
        this.onload?.();

        return this;
    }

    static instance(): XMLHttpRequestMock {
        if (!XMLHttpRequestMock.instances.length) {
            throw new Error('no initiate XMLHttpRequest');
        }

        return XMLHttpRequestMock.instances[0];
    }
}

beforeEach(() => {
    XMLHttpRequestMock.instances = [];

    vi.stubGlobal(XMLHttpRequest.name, XMLHttpRequestMock as any);
})