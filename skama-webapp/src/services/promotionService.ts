import type {
  ICreatePromotionRequest,
  ICreatePromotionResponse,
  IPromotionDto,
  IUpdatePromotionRequest,
} from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const promotionService = {
  list: () =>
    apiClient.get<IPromotionDto[]>(API_PATHS.promotions.list),

  getById: (id: string) =>
    apiClient.get<IPromotionDto>(API_PATHS.promotions.byId(id)),

  getActive: () =>
    apiClient.get<IPromotionDto[]>(API_PATHS.promotions.active),

  create: (data: ICreatePromotionRequest) =>
    apiClient.post<ICreatePromotionResponse>(API_PATHS.promotions.create, data),

  update: (id: string, data: IUpdatePromotionRequest) =>
    apiClient.put(API_PATHS.promotions.update(id), data),

  assignProduct: (promotionId: string, productId: string) =>
    apiClient.post(
      API_PATHS.promotions.assignProduct(promotionId, productId),
    ),

  removeProduct: (promotionId: string, productId: string) =>
    apiClient.delete(
      API_PATHS.promotions.removeProduct(promotionId, productId),
    ),
};
