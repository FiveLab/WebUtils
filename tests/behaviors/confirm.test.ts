import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { confirmBehavior } from '../../src';
import * as nav from '../../src/browser/navigation';

describe('confirm behavior', () => {
    let event: MouseEvent;

    beforeEach(() => {
        document.body.innerHTML = '<div>' +
            '<a id="confirm" data-confirm="Bla Bla" data-href="/new-path">1</a>' +
            '<a id="confirm-without-text" data-confirm data-href="/old-path">2</a>' +
            '<a id="single">3</a>' +
            '</div>';

        event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('confirmed', () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        const navigateSpy = vi.spyOn(nav, 'navigateTo').mockImplementation(() => {});
        const preventSpy = vi.spyOn(event, 'preventDefault');

        confirmBehavior(document.querySelector('#confirm')!, event);

        expect(window.confirm).toHaveBeenCalledWith('Bla Bla');
        expect(preventSpy).toHaveBeenCalledOnce();
        expect(navigateSpy).toHaveBeenCalledOnce();
        expect(navigateSpy).toHaveBeenCalledWith('/new-path');
    });

    it('confirmed without text', () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        const navigateSpy = vi.spyOn(nav, 'navigateTo').mockImplementation(() => {});
        const preventSpy = vi.spyOn(event, 'preventDefault');

        confirmBehavior(document.querySelector('#confirm-without-text')!, event);

        expect(window.confirm).toHaveBeenCalledWith('Are you sure want?');
        expect(preventSpy).toHaveBeenCalledOnce();
        expect(navigateSpy).toHaveBeenCalledOnce();
        expect(navigateSpy).toHaveBeenCalledWith('/old-path');
    });

    it('not confirmed', () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false);

        const navigateSpy = vi.spyOn(nav, 'navigateTo').mockImplementation(() => {});

        confirmBehavior(document.querySelector('#confirm')!, event);

        expect(navigateSpy).not.toHaveBeenCalledOnce();
    });

    it('error without data-href attribute', () => {
        expect(() => {
            confirmBehavior(document.querySelector('#single')!, event);
        }).toThrowError(new Error('Can\'t process data confirm. Missed "data-href" attribute.'));
    });
});
