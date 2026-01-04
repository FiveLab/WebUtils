import { applyTextareaAutoResize, DomChangeCallback } from '../dom';

export const createTextareaAutoResizeBehavior = (maxRows: number = 4): DomChangeCallback<HTMLTextAreaElement> => {
    return (element) => {
        applyTextareaAutoResize(element, maxRows);
    };
};
