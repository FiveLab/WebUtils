import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTextareaAutoResizeBehavior } from '../../src/behaviors';
import * as textareaModule from '../../src/dom/textarea';

describe('create textarea auto-resize behavior', () => {
    let textarea: HTMLTextAreaElement;

    beforeEach(() => {
        textarea = document.createElement('textarea');
    });

    it('calls applyTextareaAutoResize with default maxRows', () => {
        const spy = vi
            .spyOn(textareaModule, 'applyTextareaAutoResize')
            .mockImplementation(() => {
            });

        const behavior = createTextareaAutoResizeBehavior();

        behavior(textarea);

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(textarea, 4);
    });

    it('calls applyTextareaAutoResize with provided maxRows', () => {
        const spy = vi
            .spyOn(textareaModule, 'applyTextareaAutoResize')
            .mockImplementation(() => {
            });

        const behavior = createTextareaAutoResizeBehavior(8);

        behavior(textarea);

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(textarea, 8);
    });
});
