import { useCallback, useEffect, useState } from 'react';
import type { IReviewDto } from '../types';
import { reviewService } from '../services';
import { getApiErrorMessage } from '../utils';

export function useProductReviews(productId?: string) {
  const [reviews, setReviews] = useState<IReviewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!productId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await reviewService.getByProduct(productId);
      setReviews(data);
    } catch (err) {
      setReviews([]);
      setError(getApiErrorMessage(err, 'No se pudieron cargar las reseñas.'));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { reviews, loading, error, refetch };
}
