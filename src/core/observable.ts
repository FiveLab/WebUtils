export class Observable<T> {
    private listeners = new Set<(data: T) => void>();

    subscribe(callback: (data: T) => void): () => void {
        this.listeners.add(callback);

        return () => {
            this.listeners.delete(callback);
        };
    }

    emit(data: T): void {
        for (const callback of this.listeners) {
            callback(data);
        }
    }
}
