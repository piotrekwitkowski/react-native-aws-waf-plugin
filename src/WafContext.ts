import { createContext, useContext } from 'react';
import type { WafClient } from './types';

export const WafContext = createContext<WafClient | null>(null);

export function useWafClient(): WafClient {
  const client = useContext(WafContext);
  if (!client) {
    throw new Error('useWafClient must be used within a <WafProvider>');
  }
  return client;
}
