export function readBoolAttribute(element: HTMLElement, attribute: string, defaultValue: boolean): boolean;
export function readBoolAttribute(element: HTMLElement, attribute: string): boolean | undefined;

export function readBoolAttribute(element: HTMLElement, attribute: string, defaultValue?: boolean): boolean | undefined {
    if (!element.hasAttribute(attribute)) {
        return defaultValue;
    }

    const value = element.getAttribute(attribute);

    return !(value === '0' || value === 'no' || value === 'false');
}

export function readStringAttribute(element: HTMLElement, attribute: string): string;
export function readStringAttribute(element: HTMLElement, attribute: string, defaultValue?: string): string;

export function readStringAttribute(element: HTMLElement, attribute: string, defaultValue?: string): string {
    if (!element.hasAttribute(attribute)) {
        return typeof defaultValue === 'string' ? defaultValue : '';
    }

    return String(element.getAttribute(attribute));
}
