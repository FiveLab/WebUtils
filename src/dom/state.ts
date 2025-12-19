import { readBoolAttribute } from './attributes';

export function isDisabled(element: HTMLElement): boolean {
    return readBoolAttribute(element, 'disabled', false);
}

export function disableElement(element: HTMLElement): void {
    element.setAttribute('disabled', 'disabled');
}

export function enableElement(element: HTMLElement): void {
    element.removeAttribute('disabled');
}
