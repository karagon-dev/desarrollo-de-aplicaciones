import { useCallback, useEffect, useState } from 'react';
import type { IDateRangeParams, ISalesByPeriodDto, ISalesByProductDto } from '../types';
import { reportService } from '../services';
import { getApiErrorMessage } from '../utils';

interface IUseSalesReportsResult {
  salesByPeriod: ISalesByPeriodDto[];
  salesByProduct: ISalesByProductDto[];
  loading: boolean;
  error: string | null;
  fetchReports: () => Promise<void>;
}

export function useSalesReports(params: IDateRangeParams): IUseSalesReportsResult {
  const [salesByPeriod, setSalesByPeriod] = useState<ISalesByPeriodDto[]>([]);
  const [salesByProduct, setSalesByProduct] = useState<ISalesByProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    if (!params.startDate || !params.endDate) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [periodResponse, productResponse] = await Promise.all([
        reportService.getSalesByPeriod(params),
        reportService.getSalesByProduct(params),
      ]);
      setSalesByPeriod(periodResponse.data);
      setSalesByProduct(productResponse.data);
    } catch (err) {
      setSalesByPeriod([]);
      setSalesByProduct([]);
      setError(getApiErrorMessage(err, 'Could not load reports.'));
    } finally {
      setLoading(false);
    }
  }, [params.startDate, params.endDate]);

  useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  return { salesByPeriod, salesByProduct, loading, error, fetchReports };
}
