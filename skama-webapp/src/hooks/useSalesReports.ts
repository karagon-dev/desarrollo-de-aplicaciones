import { useCallback, useEffect, useState } from 'react';
import type { IDateRangeParams, ISalesByProductDto } from '../types';
import { reportService } from '../services';
import { getApiErrorMessage, sortSalesRows } from '../utils';

interface IUseSalesReportsResult {
  salesByProduct: ISalesByProductDto[];
  loading: boolean;
  error: string | null;
  fetchReports: () => Promise<ISalesByProductDto[] | null>;
}

export function useSalesReports(params: IDateRangeParams): IUseSalesReportsResult {
  const [salesByProduct, setSalesByProduct] = useState<ISalesByProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startDate, endDate } = params;

  const fetchReports = useCallback(async () => {
    if (!startDate || !endDate) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const productResponse = await reportService.getSalesByProduct({ startDate, endDate });
      const sortedSales = sortSalesRows(productResponse.data);
      setSalesByProduct(sortedSales);
      return sortedSales;
    } catch (err) {
      setSalesByProduct([]);
      setError(getApiErrorMessage(err, 'No se pudieron cargar los reportes.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  return { salesByProduct, loading, error, fetchReports };
}
