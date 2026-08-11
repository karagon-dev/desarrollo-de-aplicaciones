import { useCallback, useEffect, useState } from 'react';
import type { IProductDto, IProductImageDto } from '../types';
import { productImageService, productService } from '../services';
import { getApiErrorMessage } from '../utils';

interface IUseProductResult {
  product: IProductDto | null;
  images: IProductImageDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProduct(productId?: string): IUseProductResult {
  const [product, setProduct] = useState<IProductDto | null>(null);
  const [images, setImages] = useState<IProductImageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      setImages([]);
      setLoading(false);
      setError('Producto no encontrado.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [productResponse, imagesResponse] = await Promise.all([
        productService.getById(productId),
        productImageService.list(productId),
      ]);

      setProduct(productResponse.data);
      setImages(imagesResponse.data);
    } catch (err) {
      setProduct(null);
      setImages([]);
      setError(getApiErrorMessage(err, 'No se pudo cargar el producto.'));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { product, images, loading, error, refetch };
}
