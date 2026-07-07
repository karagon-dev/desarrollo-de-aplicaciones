import { useCallback, useEffect, useState } from 'react';
import type { IDashboardSummaryDto, IDateRangeParams } from '../types';
import { dashboardService } from '../services';
import { getApiErrorMessage } from '../utils';

interface IUseDashboardSummaryResult {
  summary: IDashboardSummaryDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardSummary(params: IDateRangeParams): IUseDashboardSummaryResult {
  const [summary, setSummary] = useState<IDashboardSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!params.startDate || !params.endDate) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await dashboardService.getSummary(params);
      setSummary(data);
    } catch (err) {
      setSummary(null);
      setError(getApiErrorMessage(err, 'No se pudo cargar el dashboard.'));
    } finally {
      setLoading(false);
    }
  }, [params.startDate, params.endDate]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { summary, loading, error, refetch };
}
