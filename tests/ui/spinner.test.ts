import { describe, expect, it } from 'vitest';
import { createSpinner } from '../../src/ui';

describe('create spinner', () => {
    it('success create', () => {
        const el = createSpinner();

        expect(el.tagName).toBe('SPAN');
        expect([...el.classList]).toStrictEqual(['spinner-border', 'mr-2']);
        expect(el.getAttribute('role')).toBe('status');
    });

    it('success create small', () => {
        const el = createSpinner('small');

        expect([...el.classList]).toEqual(['spinner-border', 'mr-2', 'spinner-border-sm']);
    })
});
