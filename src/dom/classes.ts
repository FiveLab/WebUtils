export function addClass(element: HTMLElement, ...classes: string[]): void {
    element.classList.add(...classes);
}

export function removeClass(element: HTMLElement, ...classes: string[]): void {
    element.classList.remove(...classes);
}
