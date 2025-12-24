import { describe, expect, it } from 'vitest';
import { readFileAsArrayBuffer } from '../../src/browser';
import { FileReaderMock } from '../mock/file';


describe('read file as array buffer', () => {
    it('resolves with ArrayBuffer', async () => {
        const file = new File(['hello'], 'test.bin');

        FileReaderMock.readResult = new ArrayBuffer(8);
        const buffer = await readFileAsArrayBuffer(file);

        expect(buffer).toBeInstanceOf(ArrayBuffer);
        expect(buffer.byteLength).toBe(8);
    });

    it('rejects when FileReader errors', async () => {
        FileReaderMock.readResult = new Error('read failed');

        const file = new File(['oops'], 'fail.bin');

        await expect(readFileAsArrayBuffer(file)).rejects.toThrow('read failed');
    });
});
