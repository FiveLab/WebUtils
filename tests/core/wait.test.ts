import { beforeEach, describe, expect, it, vi } from 'vitest';
import { waitProperty } from '../../src/core';

describe('wait property', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('resolves immediately if property already exists', async () => {
        const obj = {foo: 123};

        const promise = waitProperty<number>(obj, 'foo');

        await expect(promise).resolves.toBe(123);
    });

    it('resolves when property appears later', async () => {
        const obj: Record<string, unknown> = {};

        const promise = waitProperty<string>(obj, 'bar', {
            interval: 10,
            timeout: 100,
        });

        setTimeout(() => {
            obj.bar = 'hello';
        }, 30);

        vi.advanceTimersByTime(30);
        await Promise.resolve();

        await expect(promise).resolves.toBe('hello');
    });

    it('rejects on timeout', async () => {
        const obj = {};

        const promise = waitProperty(obj, 'missing', {
            interval: 10,
            timeout: 50,
        });

        vi.advanceTimersByTime(60);
        await Promise.resolve();

        await expect(promise).rejects.toThrow(
            'Property "missing" was not defined within 50ms'
        );
    });

    it('resolves multiple waiters when property appears', async () => {
        const obj: Record<string, unknown> = {};

        const p1 = waitProperty<string>(obj, 'shared', {interval: 10});
        const p2 = waitProperty<string>(obj, 'shared', {interval: 10});

        setTimeout(() => {
            obj.shared = 'ok';
        }, 20);

        vi.advanceTimersByTime(20);
        await Promise.resolve();

        const [v1, v2] = await Promise.all([p1, p2]);

        expect(v1).toBe('ok');
        expect(v2).toBe('ok');
    });
});