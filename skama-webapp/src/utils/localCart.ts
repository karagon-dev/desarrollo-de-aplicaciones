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
  originalPrice?: number;
  discountPercentage?: number;
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
  originalUnitPrice?: number;
  discountPercentage?: number;
  subtotal: number;
  imageUrl?: string;
  imageAlt?: string;
  isLimitedEdition?: boolean;
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

    const validItems = parsed.filter((item) => item.productId && item.quantity > 0);
    let hasLimitedEditionItem = false;

    return validItems.reduce<ILocalCartItem[]>((items, item) => {
      if (!item.isLimitedEdition) {
        items.push(item);
        return items;
      }

      if (hasLimitedEditionItem) {
        return items;
      }

      hasLimitedEditionItem = true;
      items.push({ ...item, quantity: 1 });
      return items;
    }, []);
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

export function hasLocalLimitedEditionCartItem(): boolean {
  return readCartFromStorage().some((item) => item.isLimitedEdition);
}

export function addLocalCartItem(product: ISkamaProduct, quantity: number): ILocalCartItem[] {
  const items = readCartFromStorage();
  const existingLimitedEditionItem = product.isLimitedEdition
    ? items.find((item) => item.isLimitedEdition)
    : undefined;

  if (existingLimitedEditionItem) {
    existingLimitedEditionItem.quantity = 1;
    writeCartToStorage(items);
    return items;
  }

  const existing = items.find((item) => item.productId === product.id);
  const maxQuantity = product.isLimitedEdition ? 1 : Math.max(product.stockQuantity, 1);
  const requestedQuantity = Math.max(1, Math.floor(quantity));

  if (existing) {
    existing.quantity = Math.min(existing.quantity + requestedQuantity, maxQuantity);
    existing.price = product.price;
    existing.originalPrice = product.originalPrice;
    existing.discountPercentage = product.discountPercentage;
    existing.stockQuantity = product.stockQuantity;
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
    originalPrice: product.originalPrice,
    discountPercentage: product.discountPercentage,
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
        ? {
            ...item,
            quantity: item.isLimitedEdition
              ? 1
              : Math.max(1, Math.min(Math.floor(quantity), item.stockQuantity || 1)),
          }
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
      originalUnitPrice: item.originalUnitPrice,
      discountPercentage: item.discountPercentage,
      subtotal: item.subtotal,
      isLimitedEdition: false,
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
    originalUnitPrice: item.originalPrice,
    discountPercentage: item.discountPercentage,
    subtotal: item.price * item.quantity,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    isLimitedEdition: item.isLimitedEdition,
  }));
}
