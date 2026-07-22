import { useCallback, useEffect, useState } from 'react';
import type { IOrderDetailDto } from '../types';
import { orderService } from '../services';
import { getApiErrorMessage } from '../utils';

interface IUseOrderResult {
  order: IOrderDetailDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrder(orderId?: string): IUseOrderResult {
  const [order, setOrder] = useState<IOrderDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!orderId) {
      setOrder(null);
      setLoading(false);
      setError('Order no encontrado.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await orderService.getDetail(orderId);
      setOrder(data);
    } catch (err) {
      setOrder(null);
      setError(getApiErrorMessage(err, 'No se pudo cargar el order.'));
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { order, loading, error, refetch };
}
