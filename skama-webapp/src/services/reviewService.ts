import type {
  ICreateReviewRequest,
  ICreateReviewResponse,
  IReviewDto,
} from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const reviewService = {
  getByProduct: (productId: string) =>
    apiClient.get<IReviewDto[]>(API_PATHS.reviews.byProduct(productId)),

  getByUser: (userId: string) =>
    apiClient.get<IReviewDto[]>(API_PATHS.reviews.byUser(userId)),

  create: (data: ICreateReviewRequest) =>
    apiClient.post<ICreateReviewResponse>(API_PATHS.reviews.create, data),
};
