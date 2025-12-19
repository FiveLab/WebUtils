import { addClass, removeClass } from './classes';

export function showElement(...elements: Array<HTMLElement>): void {
    elements.forEach((element) => {
        removeClass(element, 'd-none');

        if (element.style.display === 'none') {
            element.style.display = '';
        }
    });
}

export function hideElement(...elements: Array<HTMLElement>): void {
    elements.forEach((element) => {
        addClass(element, 'd-none');
    });
}
