import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { request } from '../../src/browser/request';
import { fetchMock, MockXMLHttpRequest } from '../setup';

describe('request', () => {
    it.each([
        [200],
        [400],
        [500]
    ])('succeeds for GET request via fetch (status %d)', async (status) => {
        fetchMock.mockResolvedValue(new Response(null, {
            status: status
        }));

        const response = await request('https://foo.local/api/endpoint');

        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith('https://foo.local/api/endpoint', undefined);
        expect(response).toStrictEqual(new Response(null, {status: status}));
    });

    it('succeeds for GET request via fetch with custom options', async () => {
        const resultResponse = new Response(null, {
            status: 200,
            headers: {
                'content-type': 'application/json'
            }
        });

        fetchMock.mockResolvedValue(resultResponse);

        const response = await request('https://foo.local/api/endpoint', {
            headers: {
                accept: 'application/json'
            }
        });

        expect(fetchMock).toHaveBeenCalledOnce();

        expect(fetchMock).toHaveBeenCalledWith('https://foo.local/api/endpoint', {
            headers: {accept: 'application/json'}
        });

        expect(response).toStrictEqual(resultResponse);
    });

    it('succeeds for POST request via fetch', async () => {
        fetchMock.mockResolvedValue(new Response('body content', {status: 200}));

        const fd = new FormData();
        fd.append('file', new File([], 'test.txt'));
        fd.append('mode', 'bla-bla');

        const response = await request('https://bar.local/api', {
            method: 'POST',
            body: fd
        });

        expect(fetchMock).toHaveBeenCalledOnce();

        expect(fetchMock).toHaveBeenCalledWith('https://bar.local/api', {
            method: 'POST',
            body: fd
        });

        expect(response.status).toBe(200);
        expect(await response.text()).toBe('body content');
    });

    it('succeeds for POST via XHR with uploaded progress', async () => {
        const uploadCb = vi.fn();

        const fd = new FormData();
        fd.append('file', new File([], 'test'));

        const promise = request('https://domain.local/api', {
            method: 'POST',
            body: fd,
            uploadProgress: uploadCb,
            headers: {
                'Accept': 'application/json',
                'X-My-Token': 'foo-bar'
            }
        });

        const xhr = MockXMLHttpRequest.instance();
        xhr.status = 200;
        xhr.response = 'body payload';
        xhr.onload?.();
        xhr.upload.onprogress?.({loaded: 50, total: 100, lengthComputable: true} as ProgressEvent);

        const response = await promise;

        expect(uploadCb).toHaveBeenCalledOnce();
        expect(uploadCb).toHaveBeenCalledWith({total: 100, loaded: 50, progress: 50});

        expect(xhr.open).toHaveBeenCalledOnce();
        expect(xhr.open).toHaveBeenCalledWith('POST', 'https://domain.local/api', true);

        expect(xhr.send).toHaveBeenCalledOnce();
        expect(xhr.send).toHaveBeenCalledWith(fd);

        expect(xhr.setRequestHeader).toHaveBeenCalledTimes(2);
        expect(xhr.setRequestHeader).toHaveBeenNthCalledWith(1, 'Accept', 'application/json');
        expect(xhr.setRequestHeader).toHaveBeenNthCalledWith(2, 'X-My-Token', 'foo-bar');

        expect(response.status).toBe(200);
        expect(await response.text()).toBe('body payload');
    });

    it('succeeds for POST via XHR with parse response headers', async () => {
        const promise = request('https://domain.local/api', {
            method: 'POST',
            body: new FormData(),
            uploadProgress: vi.fn(),
        });

        const xhr = MockXMLHttpRequest.instance();
        xhr.getAllResponseHeaders.mockReturnValue('Content-Type: application/json\r\nX-My-Key: foo-bar');
        xhr.mockReturnOk();

        const response = await promise;

        expect(response.headers).toStrictEqual(new Headers({
            'Content-Type': 'application/json',
            'X-My-Key': 'foo-bar',
        }));
    });

    it('reject via XHR', async () => {
        const promise = request('https://domain.local', {
            body: new FormData(),
            uploadProgress: vi.fn()
        });

        const xhr = MockXMLHttpRequest.instance();
        xhr.onerror?.();

        await expect(promise).rejects.toThrow(new Error('XHR network error'));
    });

    it('timeout via XHR', async () => {
        const promise = request('https://domain.local', {
            body: new FormData(),
            uploadProgress: vi.fn()
        });

        const xhr = MockXMLHttpRequest.instance();
        xhr.ontimeout?.();

        await expect(promise).rejects.toThrow(new Error('XHR timeout error'));
    });
});