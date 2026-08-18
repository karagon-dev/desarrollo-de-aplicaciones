import { useCallback, useEffect, useState } from 'react';
import type { IPromotionDto } from '../types';
import { promotionService } from '../services';
import { getApiErrorMessage } from '../utils';

interface IUsePromotionsResult {
  promotions: IPromotionDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePromotions(): IUsePromotionsResult {
  const [promotions, setPromotions] = useState<IPromotionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await promotionService.list();
      setPromotions(data);
    } catch (err) {
      setPromotions([]);
      setError(getApiErrorMessage(err, 'No se pudieron cargar las promociones.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { promotions, loading, error, refetch };
}
