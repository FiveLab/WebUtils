import { describe, expect, it } from 'vitest';
import { getExtension } from '../../src/core';

describe('get extension', () => {
    it('returns extension from filename string', () => {
        expect(getExtension('file.txt')).toBe('txt');
        expect(getExtension('archive.tar.gz')).toBe('gz');
    });

    it('returns extension from File object', () => {
        const file = new File(['content'], 'image.PNG');
        expect(getExtension(file)).toBe('png');
    });

    it('returns null when no extension', () => {
        expect(getExtension('file')).toBeNull();
        expect(getExtension('file.')).toBeNull();
    });

    it('handles hidden files correctly', () => {
        expect(getExtension('.env')).toBe('env');
        expect(getExtension('.env.local')).toBe('local');
    });
});
