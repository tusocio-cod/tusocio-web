// src/hooks/useNcmData.js
//
// Hook que gerencia o carregamento dos dados NCM e expõe:
//   - loading    : boolean — dados ainda carregando
//   - ready      : boolean — dados disponíveis
//   - error      : string|null — mensagem de erro (se houver)
//   - syncInfo   : { syncedAt, source, totalItems, fromCache }
//   - searchNcm  : (query: string) => Promise<result[]>

import { useState, useEffect, useCallback } from 'react';
import { searchNcm as _searchNcm, getSyncInfo, preloadNcmData } from '../utils/ncmSearch';

export function useNcmData() {
  const [loading,  setLoading]  = useState(true);
  const [ready,    setReady]    = useState(false);
  const [error,    setError]    = useState(null);
  const [syncInfo, setSyncInfo] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await preloadNcmData();
        if (cancelled) return;

        const info = await getSyncInfo();
        if (cancelled) return;

        setSyncInfo(info);
        setReady(true);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const searchNcm = useCallback(async (query) => {
    if (!query?.trim()) return [];
    return _searchNcm(query);
  }, []);

  return { loading, ready, error, syncInfo, searchNcm };
}
