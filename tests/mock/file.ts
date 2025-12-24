import { beforeEach, vi } from 'vitest';

export class FileReaderMock {
    static readResult: ArrayBuffer | Error | null = null;

    result: ArrayBuffer | null = null;
    error: Error | null = null;

    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    readAsArrayBuffer(_file: File) {
        queueMicrotask(() => {
            if (FileReaderMock.readResult instanceof ArrayBuffer) {
                this.result = FileReaderMock.readResult;
                this.onload?.();
            } else if (FileReaderMock.readResult instanceof Error) {
                this.error = FileReaderMock.readResult;
                this.onerror?.();
            } else {
                throw new Error('The file reader mock not configured');
            }
        });
    }
}

vi.stubGlobal('FileReader', FileReaderMock as any);

beforeEach(() => {
    FileReaderMock.readResult = null;
});
