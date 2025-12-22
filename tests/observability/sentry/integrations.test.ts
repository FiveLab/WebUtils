import { describe, expect, it, vi } from 'vitest';
import type { Event, Client } from '@sentry/core';
import { getNetworkConnection } from '../../../src/browser';
import { networkInfoIntegration } from '../../../src/observability';
import { EventHint } from '@sentry/browser';

vi.mock(import('../../../src/browser'), () => {
    return {
        getNetworkConnection: vi.fn()
    }
});

describe('network info integration', () => {
    it('success process event', async () => {
        vi.mocked(getNetworkConnection).mockReturnValue({
            effectiveType: '4g',
            downlink: 10,
            rtt: 50,
            saveData: false
        });

        const event: Event = {};
        const result = <Event>networkInfoIntegration.processEvent?.(event, {}, <any>{});

        expect(result.tags).toStrictEqual({
            network: '4g'
        });

        expect(result.contexts).toHaveProperty('Network');
        expect(result.contexts?.['Network']).toStrictEqual({
            Downlink: 10,
            'Effective type': '4g',
            RTT: 50,
            'Save data': false
        });
    });

    it('success process event if network connection info is empty', () => {
        vi.mocked(getNetworkConnection).mockReturnValue(undefined);

        const event: Event = {};
        const result = <Event>networkInfoIntegration.processEvent?.(event, {}, <any>{});

        expect(result.tags).toBeUndefined();
        expect(result.contexts).toBeUndefined();
    });
});
