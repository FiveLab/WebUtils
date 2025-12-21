export type NetworkConnectionInfo = {
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
};

export function getNetworkConnection(): NetworkConnectionInfo | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;

    return nav.connection || nav.mozConnection || nav.webkitConnection;
}
