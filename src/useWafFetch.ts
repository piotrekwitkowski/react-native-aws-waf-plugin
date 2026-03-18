import { useCallback } from 'react';
import { useWafClient } from './WafContext';
import type { WafFetchOptions, WafFetchResponse } from './types';

export function useWafFetch(): (url: string, options?: WafFetchOptions) => Promise<WafFetchResponse> {
  const client = useWafClient();

  return useCallback(
    (url: string, options?: WafFetchOptions) => client.fetch(url, options),
    [client],
  );
}
