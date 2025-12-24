export function getExtension(value: string | File): string | null {
    const name = typeof value === 'string' ? value : value.name;

    const index = name.lastIndexOf('.');

    if (index === -1 || index === name.length - 1) {
        return null;
    }

    return name.slice(index + 1).toLowerCase();
}
