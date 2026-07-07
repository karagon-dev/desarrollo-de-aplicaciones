import type {
  ICreateProductRequest,
  ICreateProductResponse,
  IProductDto,
  IProductFilters,
  IUpdateProductRequest,
} from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const productService = {
  list: (filters?: IProductFilters) =>
    apiClient.get<IProductDto[]>(API_PATHS.products.list, { params: filters }),

  getById: (id: string) =>
    apiClient.get<IProductDto>(API_PATHS.products.byId(id)),

  create: (data: ICreateProductRequest) =>
    apiClient.post<ICreateProductResponse>(API_PATHS.products.create, data),

  update: (id: string, data: IUpdateProductRequest) =>
    apiClient.put(API_PATHS.products.update(id), data),

  delete: (id: string) => apiClient.delete(API_PATHS.products.delete(id)),
};
