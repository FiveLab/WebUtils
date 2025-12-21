function findEmbeddedScript(id: string): HTMLScriptElement | null {
    return document.querySelector(`script[type="application/json"][id="${id}"]`) ||
        document.querySelector(`script[type="application/json"][data-${id}]`);
}

export function existsEmbeddedData(id: string): boolean {
    return Boolean(findEmbeddedScript(id));
}

type EmbeddedData = Record<string, unknown>

export function readEmbeddedData<T extends EmbeddedData = EmbeddedData>(id: string): T;
export function readEmbeddedData<T extends EmbeddedData = EmbeddedData>(script: HTMLScriptElement): T;

export function readEmbeddedData<T extends EmbeddedData = EmbeddedData>(script: unknown): T | null {
    let embeddedData: string | null = null;

    if (typeof script === 'string') {
        const scriptEl = findEmbeddedScript(script);

        if (!scriptEl) {
            throw new Error(`Can't find script[type="application/json"] with id "${script}".`);
        }

        embeddedData = scriptEl.textContent;
    } else if (script instanceof Element) {
        if (script.nodeName.toLowerCase() !== 'script') {
            throw new Error(`Can't read embedded data from "${script.nodeName}" node.`);
        }

        embeddedData = script.textContent;
    } else {
        throw new TypeError('Unknown input script.');
    }

    return embeddedData.length ? JSON.parse(embeddedData) : null;
}
