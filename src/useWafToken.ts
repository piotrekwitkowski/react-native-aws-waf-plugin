import { useCallback, useEffect, useState } from 'react';
import { useWafClient } from './WafContext';
import type { WafTokenState } from './types';

export function useWafToken(): WafTokenState {
  const client = useWafClient();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const t = await client.getToken();
      setToken(t);
      setLoading(false);
      return t;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [client]);

  useEffect(() => {
    if (client.isReady && !token && !loading) {
      refresh().catch(() => {});
    }
  }, [client.isReady, token, loading, refresh]);

  return { token, loading, error, refresh };
}
