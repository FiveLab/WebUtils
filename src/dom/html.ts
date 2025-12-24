export function replaceHtmlString<T extends HTMLElement = HTMLElement>(element: T, replacements: Record<string, string>): T {
    let html = element.outerHTML;

    for (const [key, value] of Object.entries(replacements)) {
        html = html.replaceAll(key, value);
    }

    const template = document.createElement('template');
    template.innerHTML = html.trim();

    const newElement = template.content.firstElementChild;

    if (!(newElement instanceof HTMLElement)) {
        throw new Error('replaceHtmlString: result is not HTMLElement');
    }

    if (newElement.tagName !== element.tagName) {
        throw new Error(`replaceHtmlString: element tag changed from <${element.tagName.toLowerCase()}> to <${newElement.tagName.toLowerCase()}>`);
    }

    return newElement as T;
}

export function createElementFromHtml(html: string): HTMLElement {
    const template = document.createElement('template');
    template.innerHTML = html.trim();

    const element = template.content.firstElementChild;

    if (!(element instanceof HTMLElement)) {
        throw new Error('createElementFromHtml: HTML did not produce a HTMLElement');
    }

    return element;
}

export function replaceElement(element: Element, replacement: string): Element;
export function replaceElement<T extends Element = Element>(element: T, replacement: T): T;

export function replaceElement(element: Element, replacement: Element | string): Element {
    let newElement: Element;

    if (typeof replacement === 'string') {
        newElement = createElementFromHtml(replacement);
    } else {
        newElement = replacement;
    }

    element.replaceWith(newElement);

    return newElement;
}