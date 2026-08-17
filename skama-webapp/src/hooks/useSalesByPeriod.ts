import { useCallback, useEffect, useState } from 'react';
import type { IDateRangeParams, ISalesByPeriodDto } from '../types';
import { reportService } from '../services';
import { getApiErrorMessage } from '../utils';

interface IUseSalesByPeriodResult {
  salesByPeriod: ISalesByPeriodDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSalesByPeriod(params: IDateRangeParams): IUseSalesByPeriodResult {
  const [salesByPeriod, setSalesByPeriod] = useState<ISalesByPeriodDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { startDate, endDate } = params;

  const refetch = useCallback(async () => {
    if (!startDate || !endDate) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await reportService.getSalesByPeriod({ startDate, endDate });
      setSalesByPeriod(data);
    } catch (err) {
      setSalesByPeriod([]);
      setError(getApiErrorMessage(err, 'No se pudo cargar la tendencia de ventas.'));
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { salesByPeriod, loading, error, refetch };
}
