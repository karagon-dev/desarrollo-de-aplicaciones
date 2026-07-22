import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { IWishlistItemDto } from '../types';
import { wishlistService } from '../services';
import { getApiErrorMessage } from '../utils';
import { useAuth } from './AuthProvider';

interface IWishlistContextValue {
  items: IWishlistItemDto[];
  favoriteProductIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  refreshWishlist: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<boolean>;
  isFavorite: (productId: string) => boolean;
}

const WishlistContext = createContext<IWishlistContextValue | null>(null);

interface IWishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: IWishlistProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<IWishlistItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await wishlistService.getByUser(user.userId);
      setItems(data);
    } catch (err) {
      setItems([]);
      setError(getApiErrorMessage(err, 'Could not load favorites.'));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      void refreshWishlist();
    } else {
      setItems([]);
      setError(null);
    }
  }, [isAuthenticated, user, refreshWishlist]);

  const favoriteProductIds = useMemo(
    () => new Set(items.map((item) => item.productId)),
    [items],
  );

  const isFavorite = useCallback(
    (productId: string) => favoriteProductIds.has(productId),
    [favoriteProductIds],
  );

  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (!user) {
        throw new Error('You must sign in to save favorites.');
      }

      setError(null);
      const { data } = await wishlistService.toggle(user.userId, { productId });
      await refreshWishlist();
      return data.isFavorite;
    },
    [user, refreshWishlist],
  );

  const value = useMemo<IWishlistContextValue>(
    () => ({
      items,
      favoriteProductIds,
      isLoading,
      error,
      refreshWishlist,
      toggleFavorite,
      isFavorite,
    }),
    [items, favoriteProductIds, isLoading, error, refreshWishlist, toggleFavorite, isFavorite],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): IWishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
