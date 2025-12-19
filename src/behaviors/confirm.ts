import { navigateTo } from '../browser/navigation';

export const kAttrHref = 'data-href';
export const kAttrConfirm = 'data-confirm';

export function confirmBehavior(element: HTMLElement, event: Event): void {
    event.preventDefault();

    const href = element.getAttribute(kAttrHref);
    const message = element.getAttribute(kAttrConfirm) || 'Are you sure want?';

    if (!href) {
        throw new Error(`Can't process data confirm. Missed "${kAttrHref}" attribute.`);
    }

    if (confirm(message)) {
        navigateTo(href);
    }
}
