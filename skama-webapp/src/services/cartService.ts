import type {
  IAddCartItemRequest,
  IAddCartItemResponse,
  ICartDetailDto,
  ICartDto,
  ICartSummaryResponse,
  IUpdateCartItemRequest,
} from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const cartService = {
  getOrCreate: (userId: string) =>
    apiClient.post<ICartSummaryResponse>(API_PATHS.cart.getOrCreate(userId)),

  getByUser: (userId: string) =>
    apiClient.get<ICartDto>(API_PATHS.cart.getByUser(userId)),

  getById: (cartId: string) =>
    apiClient.get<ICartDetailDto>(API_PATHS.cart.getById(cartId)),

  addItem: (cartId: string, data: IAddCartItemRequest) =>
    apiClient.post<IAddCartItemResponse>(API_PATHS.cart.addItem(cartId), data),

  updateItem: (cartItemId: string, data: IUpdateCartItemRequest) =>
    apiClient.put(API_PATHS.cart.updateItem(cartItemId), data),

  deleteItem: (cartItemId: string) =>
    apiClient.delete(API_PATHS.cart.deleteItem(cartItemId)),
};
