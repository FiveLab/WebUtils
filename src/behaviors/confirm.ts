import { navigateTo } from '../browser/navigation';
import { DomEventCallback } from '../dom';
import { kAttrConfirm, kAttrHref } from '../core/constants';

export const confirmBehavior: DomEventCallback<HTMLElement> = (element: HTMLElement, event: Event): void => {
    event.preventDefault();

    const href = element.getAttribute(kAttrHref);
    const message = element.getAttribute(kAttrConfirm) || 'Are you sure want?';

    if (!href) {
        throw new Error(`Can't process data confirm. Missed "${kAttrHref}" attribute.`);
    }

    if (confirm(message)) {
        navigateTo(href);
    }
};
