import { copyToClipboard } from '../browser';
import { DomEventCallback, readStringAttribute } from '../dom';

export type CopyBehaviorOptions = {
    success?: (text: string, element: HTMLElement) => void;
};

export const kAttrCopy = 'data-copy';
export const kAttrMessage = 'data-copy-message';

const copyBehavior: DomEventCallback<HTMLElement> = async (element: HTMLElement, event: Event) => {
    if (element.nodeName.toLowerCase() === 'a' && element.getAttribute('href') === '#') {
        event.preventDefault();
    }

    const data = readStringAttribute(element, kAttrCopy);

    await copyToClipboard(data);
};

export const createCopyBehavior = (options?: CopyBehaviorOptions): DomEventCallback<HTMLElement> => {
    return async (el: HTMLElement, ev: Event) => {
        await copyBehavior(el, ev);

        const message = readStringAttribute(el, kAttrMessage, 'Success copy to clipboard.');
        options?.success?.(message, el);
    };
};
