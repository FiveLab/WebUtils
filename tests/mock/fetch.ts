import { beforeEach, vi } from 'vitest';

export const fetchMock = vi.fn();

beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
});
