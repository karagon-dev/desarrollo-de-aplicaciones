import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ICartDetailDto } from '../types';
import { cartService } from '../services';
import { getApiErrorMessage } from '../utils';
import { useAuth } from './AuthProvider';

interface ICartContextValue {
  cart: ICartDetailDto | null;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
}

const CartContext = createContext<ICartContextValue | null>(null);

interface ICartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: ICartProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<ICartDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: summary } = await cartService.getOrCreate(user.userId);
      const { data: detail } = await cartService.getById(summary.cartId);
      setCart(detail);
    } catch (err) {
      setCart(null);
      setError(getApiErrorMessage(err, 'Could not load cart.'));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      void refreshCart();
    } else {
      setCart(null);
      setError(null);
    }
  }, [isAuthenticated, user, refreshCart]);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      if (!user) {
        throw new Error('You must sign in to add products to the cart.');
      }

      setError(null);
      const { data: summary } = await cartService.getOrCreate(user.userId);
      await cartService.addItem(summary.cartId, { productId, quantity });
      await refreshCart();
    },
    [user, refreshCart],
  );

  const updateItemQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      setError(null);
      await cartService.updateItem(cartItemId, { quantity });
      await refreshCart();
    },
    [refreshCart],
  );

  const removeItem = useCallback(
    async (cartItemId: string) => {
      setError(null);
      await cartService.deleteItem(cartItemId);
      await refreshCart();
    },
    [refreshCart],
  );

  const itemCount = useMemo(
    () => cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0,
    [cart],
  );

  const value = useMemo<ICartContextValue>(
    () => ({
      cart,
      itemCount,
      isLoading,
      error,
      refreshCart,
      addItem,
      updateItemQuantity,
      removeItem,
    }),
    [cart, itemCount, isLoading, error, refreshCart, addItem, updateItemQuantity, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): ICartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
