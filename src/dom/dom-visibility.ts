export function showElement(element: HTMLElement): void {
    element.classList.remove('d-none');
}

export function hideElement(element: HTMLElement): void {
    element.classList.add('d-none');
}
