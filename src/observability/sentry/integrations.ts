import type { Integration } from '@sentry/core';
import { getNetworkConnection } from '../../browser';

export const networkInfoIntegration: Integration = {
    name: 'NetworkInfo',
    processEvent: (event) => {
        const network = getNetworkConnection();

        if (network) {
            event.contexts ??= {};

            event.contexts['Network'] = {
                'Effective type': network.effectiveType,
                Downlink: network.downlink,
                RTT: network.rtt,
                'Save data': network.saveData,
            };

            event.tags = {
                ...event.tags,
                network: network.effectiveType,
            };
        }

        return event;
    },
};
