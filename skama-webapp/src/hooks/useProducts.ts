import { useCallback, useEffect, useState } from 'react';
import type { IProductDto, IProductFilters } from '../types';
import { productService } from '../services';
import { getApiErrorMessage } from '../utils';

interface IUseProductsResult {
  products: IProductDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProducts(filters?: IProductFilters): IUseProductsResult {
  const [products, setProducts] = useState<IProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await productService.list(filters);
      setProducts(data);
    } catch (err) {
      setProducts([]);
      setError(getApiErrorMessage(err, 'No se pudieron cargar los productos.'));
    } finally {
      setLoading(false);
    }
  }, [filters?.search, filters?.categoryId, filters?.includeInactive]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { products, loading, error, refetch };
}
