import { addClass, disableElement, DomChangeCallback, enableElement, readBoolAttribute, readStringAttribute, removeClass } from '../dom';
import { createSpinner } from '../ui';

type ProcessingMode = 'prepend' | 'replace';

export const kProcessingAttribute = 'data-processing';
export const kProcessingModeAttribute = 'data-processing-mode';

export const processingBehavior: DomChangeCallback<HTMLElement> = (element): void => {
    const processing = readBoolAttribute(element, kProcessingAttribute);
    const mode: ProcessingMode = <ProcessingMode>readStringAttribute(element, kProcessingModeAttribute, 'prepend');

    if (processing) {
        if (element.querySelector('[role="status"]')) {
            // Spinner already exist. Nothing action.
            return;
        }

        const spinner = createSpinner('small');

        if (mode === 'prepend') {
            element.prepend(spinner);
        } else {
            element.setAttribute('data-html', element.innerHTML);
            element.innerHTML = spinner.outerHTML;
        }

        disableElement(element);

        if (element.tagName.toLowerCase() === 'a') {
            addClass(element, 'disabled');
        }
    } else {
        enableElement(element);

        (<HTMLSpanElement | null>element.querySelector('[role="status"]'))?.remove();

        if (element.tagName.toLowerCase() === 'a') {
            removeClass(element, 'disabled');
        }

        if (mode === 'replace') {
            element.innerHTML = readStringAttribute(element, 'data-html');
            element.removeAttribute('data-html');
        }
    }
};
