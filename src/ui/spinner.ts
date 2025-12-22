import { addClass } from '../dom';

export function createSpinner(size: 'small' | 'normal' = 'normal'): HTMLSpanElement {
    const spinner = document.createElement('span');
    addClass(spinner, 'spinner-border', 'mr-2');
    spinner.setAttribute('role', 'status');

    if (size === 'small') {
        addClass(spinner, 'spinner-border-sm');
    }

    return spinner;
}