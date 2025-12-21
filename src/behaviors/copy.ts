import { copyToClipboard } from '../browser';
import { readStringAttribute } from '../dom';

export type CopyBehaviorOptions = {
    success?: (text: string, element: HTMLElement) => void;
};

export const kAttrCopy = 'data-copy';
export const kAttrMessage = 'data-copy-message';

export async function copyBehavior(element: HTMLElement, event: Event, options?: CopyBehaviorOptions) {
    if (element.nodeName.toLowerCase() === 'a' && element.getAttribute('href') === '#') {
        event.preventDefault();
    }

    const data = readStringAttribute(element, kAttrCopy);
    const message = readStringAttribute(element, kAttrMessage, 'Success copy to clipboard.');

    await copyToClipboard(data);

    if (options && options.success) {
        options.success(message, element);
    }
}

export function createCopyBehavior(options: CopyBehaviorOptions) {
    return async (el: HTMLElement, ev: Event) => {
        await copyBehavior(el, ev, options);
    };
}
