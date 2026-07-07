import type {
  IAddWishlistItemRequest,
  IAddWishlistItemResponse,
  IToggleWishlistRequest,
  IToggleWishlistResponse,
  IWishlistItemDto,
} from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const wishlistService = {
  getByUser: (userId: string) =>
    apiClient.get<IWishlistItemDto[]>(API_PATHS.wishlist.byUser(userId)),

  add: (userId: string, data: IAddWishlistItemRequest) =>
    apiClient.post<IAddWishlistItemResponse>(
      API_PATHS.wishlist.add(userId),
      data,
    ),

  remove: (userId: string, productId: string) =>
    apiClient.delete(API_PATHS.wishlist.remove(userId, productId)),

  toggle: (userId: string, data: IToggleWishlistRequest) =>
    apiClient.post<IToggleWishlistResponse>(
      API_PATHS.wishlist.toggle(userId),
      data,
    ),
};
