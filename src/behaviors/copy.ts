import { copyToClipboard } from '../browser';
import { DomEventCallback, readStringAttribute } from '../dom';
import { kAttrCopy, kAttrMessage } from '../core/constants';

export type CopyBehaviorOptions = {
    success?: (text: string, element: HTMLElement) => void;
};

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
