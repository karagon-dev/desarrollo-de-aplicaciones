import { useCallback, useEffect, useState } from 'react';
import type { ICategoryDto } from '../types';
import { categoryService } from '../services';
import { getApiErrorMessage } from '../utils';

interface IUseCategoriesResult {
  categories: ICategoryDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCategories(): IUseCategoriesResult {
  const [categories, setCategories] = useState<ICategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await categoryService.list(false);
      setCategories(data);
    } catch (err) {
      setCategories([]);
      setError(getApiErrorMessage(err, 'Could not load categories.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { categories, loading, error, refetch };
}
