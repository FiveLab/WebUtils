import { readBoolAttribute } from './attributes';
import { kProcessingAttribute } from '../behaviors';
import { isDisabled } from './state';

type FormElementValue = | string | boolean | number | File | File[] | null;
type OutputCtor = typeof FormData | typeof URLSearchParams;

type FormDataResult<T> =
    T extends typeof FormData ? FormData :
        T extends typeof URLSearchParams ? URLSearchParams :
            URLSearchParams;

const kAttrFormProcessing = 'data-form-processing';

function getFormControls(form: HTMLFormElement): HTMLElement[] {
    return Array.from(form.querySelectorAll<HTMLElement>('input, select, textarea, button'));
}

export function startFormProcessing(form: HTMLFormElement): void {
    getFormControls(form).forEach((el) => {
        if ((el as HTMLInputElement).disabled) {
            return;
        }

        (el as HTMLInputElement).disabled = true;

        el.setAttribute(kAttrFormProcessing, 'true');
    });

    form.querySelector('button[type="submit"]')?.setAttribute(kProcessingAttribute, '1');
}

export function endFormProcessing(form: HTMLFormElement): void {
    getFormControls(form).forEach((el) => {
        if (readBoolAttribute(el, kAttrFormProcessing)) {
            (el as HTMLInputElement).disabled = false;

            el.removeAttribute(kAttrFormProcessing);
        }
    });

    form.querySelector('button[type="submit"]')?.removeAttribute(kProcessingAttribute);
}

export function readInputValue(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): string {
    return element.value;
}

export function readCheckboxValue(input: HTMLInputElement): boolean {
    if (input.type !== 'checkbox') {
        throw new TypeError('Expected checkbox input');
    }

    return input.checked;
}

export function readRadioValue(form: HTMLFormElement, name: string): string | null {
    const checked = form.querySelector<HTMLInputElement>(`input[type="radio"][name="${name}"]:checked`);

    return checked?.value ?? null;
}

export function readNumberInput(element: HTMLInputElement): number | null {
    const value = element.value.trim();

    if (value === '') {
        return null;
    }

    const num = Number(value);

    return Number.isNaN(num) ? null : num;
}

export function readBooleanInput(element: HTMLInputElement): boolean {
    return element.checked;
}

export function readFileInput(input: HTMLInputElement): File | File[] | null {
    if (input.type !== 'file') {
        throw new TypeError('Expected file input');
    }

    const files = input.files;

    if (!files || files.length === 0) {
        return null;
    }

    if (input.multiple) {
        return Array.from(files);
    }

    return files[0] ?? null;
}

export function readElementValue(element: Element): FormElementValue {
    if (element instanceof HTMLInputElement) {
        switch (element.type) {
            case 'checkbox':
                return readCheckboxValue(element);

            case 'number':
                return readNumberInput(element);

            case 'radio':
                if (!element.form || !element.name) {
                    return null;
                }

                return readRadioValue(element.form, element.name);

            case 'file':
                return readFileInput(element);

            default:
                return readInputValue(element);
        }
    }

    if (element instanceof HTMLTextAreaElement) {
        return readInputValue(element);
    }

    if (element instanceof HTMLSelectElement) {
        return readInputValue(element);
    }

    return null;
}

export function readFormData(form: HTMLFormElement): URLSearchParams;
export function readFormData<T extends OutputCtor>(form: HTMLFormElement, output: T): FormDataResult<T>;

export function readFormData(form: HTMLFormElement, output: OutputCtor = URLSearchParams): FormData | URLSearchParams {
    const result =
        output === FormData
            ? new FormData()
            : new URLSearchParams();

    const elements = Array.from(form.elements);

    const append = (target: FormData | URLSearchParams, key: string, value: string | number | boolean | File): void => {
        const v =
            typeof value === 'boolean'
                ? value ? '1' : '0'
                : typeof value === 'number'
                    ? String(value)
                    : value;

        if (target instanceof FormData) {
            target.append(key, v);
        } else {
            target.append(key, String(v));
        }
    };

    for (const el of elements) {
        if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
            if (!('name' in el)) {
                continue;
            }

            if (isDisabled(el)) {
                continue;
            }

            if (!el.name) {
                continue;
            }

            const value = readElementValue(el);

            if (value === null) {
                continue;
            }

            // File[]
            if (Array.isArray(value)) {
                for (const v of value) {
                    append(result, el.name, v);
                }

                continue;
            }

            append(result, el.name, value);
        }
    }

    return result;
}
