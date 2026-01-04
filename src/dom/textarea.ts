import { kAttrMaxRows } from '../core/constants';

export function applyTextareaAutoResize(textarea: HTMLTextAreaElement, maxRows: number = 4): void {
    const computed = window.getComputedStyle(textarea);

    const attr = textarea.getAttribute(kAttrMaxRows);
    const limit = attr ? Number.parseInt(attr, 10) : maxRows;

    const fontSize = Number.parseFloat(computed.fontSize) || 16;
    const lineHeight = computed.lineHeight === 'normal' ? fontSize * 1.2 : Number.parseFloat(computed.lineHeight);

    const paddingY =
        (Number.parseFloat(computed.paddingTop) || 0) +
        (Number.parseFloat(computed.paddingBottom) || 0);

    const lines = Math.max(1, textarea.value.split('\n').length);
    const visibleLines = Math.min(lines, Number.isFinite(limit) ? limit : maxRows);

    textarea.style.height = `${lineHeight * visibleLines + paddingY}px`;
}
