import { describe, expect, it } from 'vitest';
import { diffTime } from '../../src/core';

describe('diff time', () => {
    it('returns zeros when dates are equal', () => {
        const d = new Date('2025-01-01T00:00:00.000Z');

        expect(diffTime(d, d)).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        });
    });

    it('handles exactly 60 seconds', () => {
        const from = new Date('2025-01-01T00:00:00.000Z');
        const to = new Date('2025-01-01T00:01:00.000Z');

        expect(diffTime(from, to)).toEqual({
            days: 0,
            hours: 0,
            minutes: 1,
            seconds: 0,
        });
    });

    it('handles exactly 3600 seconds', () => {
        const from = new Date('2025-01-01T00:00:00.000Z');
        const to = new Date('2025-01-01T01:00:00.000Z');

        expect(diffTime(from, to)).toEqual({
            days: 0,
            hours: 1,
            minutes: 0,
            seconds: 0,
        });
    });

    it('handles exactly 86400 seconds', () => {
        const from = new Date('2025-01-01T00:00:00.000Z');
        const to = new Date('2025-01-02T00:00:00.000Z');

        expect(diffTime(from, to)).toEqual({
            days: 1,
            hours: 0,
            minutes: 0,
            seconds: 0,
        });
    });

    it('splits mixed duration correctly', () => {
        // 1 day, 2 hours, 3 minutes, 4 seconds = 86400 + 7200 + 180 + 4
        const from = new Date('2025-01-01T00:00:00.000Z');
        const to = new Date(from.getTime() + (86400 + 7200 + 180 + 4) * 1000);

        expect(diffTime(from, to)).toEqual({
            days: 1,
            hours: 2,
            minutes: 3,
            seconds: 4,
        });
    });

    it('floors milliseconds to seconds', () => {
        const from = new Date('2025-01-01T00:00:00.000Z');
        const to = new Date('2025-01-01T00:00:01.900Z'); // 1.9s -> 1s

        expect(diffTime(from, to)).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 1,
        });
    });

    it('returns negative components when "to" is earlier than "from"', () => {
        const from = new Date('2025-01-01T00:00:00.000Z');
        const to = new Date('2024-12-31T23:59:50.000Z'); // -10s

        expect(diffTime(from, to)).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: -10,
        });
    });

    it('returns negative split duration correctly', () => {
        // - (1 hour, 2 minutes, 3 seconds)
        const from = new Date('2025-01-01T00:00:00.000Z');
        const to = new Date(from.getTime() - (3600 + 120 + 3) * 1000);

        expect(diffTime(from, to)).toEqual({
            days: 0,
            hours: -1,
            minutes: -2,
            seconds: -3,
        });
    });
});