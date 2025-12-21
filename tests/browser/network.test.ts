import { beforeEach, describe, expect, it } from 'vitest';
import { getNetworkConnection, NetworkConnectionInfo } from '../../src/browser';

describe('get network connection', () => {
    const networkInfo: NetworkConnectionInfo = {
        downlink: 10,
        rtt: 50,
        effectiveType: '3g',
        saveData: false
    };

    beforeEach(() => {
        (navigator as any).connection = undefined;
        (navigator as any).mozConnection = undefined;
        (navigator as any).webkitConnection = undefined;
    });

    it('from connection', () => {
        (navigator as any).connection = networkInfo;

        const result = getNetworkConnection();

        expect(result).toBe(networkInfo);
    });

    it('from mozConnection', () => {
        (navigator as any).mozConnection = networkInfo;

        const result = getNetworkConnection();

        expect(result).toBe(networkInfo);
    });

    it('from webkitConnection', () => {
        (navigator as any).webkitConnection = networkInfo;

        const result = getNetworkConnection();

        expect(result).toBe(networkInfo);
    });

    it('as undefined', () => {
        const result = getNetworkConnection();

        expect(result).toBeUndefined();
    })
});
