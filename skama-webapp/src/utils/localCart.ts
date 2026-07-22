import type { ICartDetailDto } from '../types';
import type { ISkamaProduct } from '../data/skamaCatalog';

export interface ILocalCartItem {
  id: string;
  productId: string;
  name: string;
  collection: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  isLimitedEdition: boolean;
}

export interface ICheckoutItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl?: string;
  imageAlt?: string;
}

const LOCAL_CART_KEY = 'skama-local-cart';
export const LOCAL_CART_UPDATED_EVENT = 'skama-local-cart-updated';

function emitCartUpdate(): void {
  window.dispatchEvent(new Event(LOCAL_CART_UPDATED_EVENT));
}

function readCartFromStorage(): ILocalCartItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as ILocalCartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => item.productId && item.quantity > 0);
  } catch {
    return [];
  }
}

function writeCartToStorage(items: ILocalCartItem[]): void {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
  emitCartUpdate();
}

export function readLocalCart(): ILocalCartItem[] {
  return readCartFromStorage();
}

export function addLocalCartItem(product: ISkamaProduct, quantity: number): ILocalCartItem[] {
  const items = readCartFromStorage();
  const existing = items.find((item) => item.productId === product.id);
  const maxQuantity = product.isLimitedEdition ? 1 : Math.max(product.stockQuantity, 1);
  const requestedQuantity = Math.max(1, Math.floor(quantity));

  if (existing) {
    existing.quantity = Math.min(existing.quantity + requestedQuantity, maxQuantity);
    writeCartToStorage(items);
    return items;
  }

  const nextItem: ILocalCartItem = {
    id: crypto.randomUUID(),
    productId: product.id,
    name: product.name,
    collection: product.collection,
    description: product.description,
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
    price: product.price,
    quantity: Math.min(requestedQuantity, maxQuantity),
    stockQuantity: product.stockQuantity,
    isLimitedEdition: Boolean(product.isLimitedEdition),
  };

  const nextItems = [...items, nextItem];
  writeCartToStorage(nextItems);
  return nextItems;
}

export function updateLocalCartItemQuantity(productId: string, quantity: number): ILocalCartItem[] {
  const items = readCartFromStorage();
  const nextItems = items
    .map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, Math.min(Math.floor(quantity), item.stockQuantity || 1)) }
        : item,
    )
    .filter((item) => item.quantity > 0);

  writeCartToStorage(nextItems);
  return nextItems;
}

export function removeLocalCartItem(productId: string): ILocalCartItem[] {
  const nextItems = readCartFromStorage().filter((item) => item.productId !== productId);
  writeCartToStorage(nextItems);
  return nextItems;
}

export function clearLocalCart(): void {
  writeCartToStorage([]);
}

export function getLocalCartTotals(items: ILocalCartItem[]) {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.quantity * item.price, 0);

  return {
    itemCount,
    subtotal,
    total: subtotal,
  };
}

export function backendCartToCheckoutItems(cart: ICartDetailDto | null): ICheckoutItem[] {
  return (
    cart?.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    })) ?? []
  );
}

export function localCartToCheckoutItems(items: ILocalCartItem[]): ICheckoutItem[] {
  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
    subtotal: item.price * item.quantity,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
  }));
}
