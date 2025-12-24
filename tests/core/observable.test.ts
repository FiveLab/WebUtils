import { describe, expect, it, vi } from 'vitest';
import { Observable } from '../../src/core/observable';

describe('observable', () => {
    it('notifies single subscriber', () => {
        const obs = new Observable<number>();
        const cb = vi.fn();

        obs.subscribe(cb);
        obs.emit(42);

        expect(cb).toHaveBeenCalledOnce();
        expect(cb).toHaveBeenCalledWith(42);
    });

    it('notifies multiple subscribers', () => {
        const obs = new Observable<string>();
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        obs.subscribe(cb1);
        obs.subscribe(cb2);

        obs.emit('hello');

        expect(cb1).toHaveBeenCalledWith('hello');
        expect(cb2).toHaveBeenCalledWith('hello');
    });

    it('does not notify unsubscribed listener', () => {
        const obs = new Observable<boolean>();
        const cb = vi.fn();

        const unsubscribe = obs.subscribe(cb);
        unsubscribe();

        obs.emit(true);

        expect(cb).not.toHaveBeenCalled();
    });

    it('unsubscribe removes only that listener', () => {
        const obs = new Observable<number>();
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        const unsubscribe1 = obs.subscribe(cb1);
        obs.subscribe(cb2);

        unsubscribe1();
        obs.emit(1);

        expect(cb1).not.toHaveBeenCalled();
        expect(cb2).toHaveBeenCalledOnce();
    });

    it('allows emitting multiple times', () => {
        const obs = new Observable<number>();
        const cb = vi.fn();

        obs.subscribe(cb);

        obs.emit(1);
        obs.emit(2);

        expect(cb).toHaveBeenCalledTimes(2);
        expect(cb).toHaveBeenNthCalledWith(1, 1);
        expect(cb).toHaveBeenNthCalledWith(2, 2);
    });

    it('does not break if no listeners are registered', () => {
        const obs = new Observable<number>();

        expect(() => {
            obs.emit(123);
        }).not.toThrow();
    });

    it('does not register the same callback twice (Set behavior)', () => {
        const obs = new Observable<string>();
        const cb = vi.fn();

        obs.subscribe(cb);
        obs.subscribe(cb);

        obs.emit('x');

        expect(cb).toHaveBeenCalledOnce();
    });
});
