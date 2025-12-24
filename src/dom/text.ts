type AnimateEllipsisOptions = {
    maxDots?: number;
    interval?: number;
}

export function animateEllipsis(element: HTMLElement, options?: AnimateEllipsisOptions): () => void {
    const maxDots = options?.maxDots ?? 3;
    const interval = options?.interval ?? 250;

    let dots = 0;
    let timer: number | null = null;

    const dotsContainer = document.createElement('span');
    dotsContainer.setAttribute('aria-hidden', 'true');

    const dotsElements: HTMLSpanElement[] = [];

    for (let i = 0; i < maxDots; i++) {
        const dot = document.createElement('span');
        dot.textContent = '.';
        dot.style.visibility = 'hidden';
        dotsContainer.appendChild(dot);
        dotsElements.push(dot);
    }

    element.appendChild(dotsContainer);

    const tick = () => {
        if (!element.isConnected) {
            stop();

            return;
        }

        dots = (dots + 1) % (maxDots + 1);

        dotsElements.forEach((dot, index) => {
            dot.style.visibility = index < dots ? 'visible' : 'hidden';
        });

        timer = window.setTimeout(tick, interval);
    };

    const stop = () => {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }

        dotsContainer.remove();
    };

    tick();

    return stop;
}
