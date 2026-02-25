import { getFullnodeUrl } from '@mysten/sui/client';

export const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
} as const;

export type NetworkName = keyof typeof networks;

export const defaultNetwork: NetworkName = 'testnet';
