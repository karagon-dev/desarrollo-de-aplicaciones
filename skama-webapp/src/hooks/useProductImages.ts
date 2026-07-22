import { useEffect, useState } from 'react';
import type { IProductImageDto } from '../types';
import { productImageService } from '../services';

export function useProductMainImages(productIds: string[]): Record<string, string | undefined> {
  const [imageMap, setImageMap] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (productIds.length === 0) {
      setImageMap({});
      return;
    }

    let cancelled = false;

    async function loadImages() {
      const entries = await Promise.all(
        productIds.map(async (productId) => {
          try {
            const { data } = await productImageService.list(productId);
            const mainImage = data.find((image) => image.isMain) ?? data[0];
            return [productId, mainImage?.imageUrl] as const;
          } catch {
            return [productId, undefined] as const;
          }
        }),
      );

      if (!cancelled) {
        setImageMap(Object.fromEntries(entries));
      }
    }

    void loadImages();

    return () => {
      cancelled = true;
    };
  }, [productIds.join('|')]);

  return imageMap;
}

export function useProductImages(productId?: string) {
  const [images, setImages] = useState<IProductImageDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refetch() {
    if (!productId) {
      setImages([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await productImageService.list(productId);
      setImages(data);
    } catch {
      setImages([]);
      setError('Could not load images.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refetch();
  }, [productId]);

  return { images, loading, error, refetch };
}
