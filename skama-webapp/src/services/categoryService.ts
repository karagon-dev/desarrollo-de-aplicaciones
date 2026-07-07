import type {
  ICategoryDto,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
} from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const categoryService = {
  list: (includeInactive = false) =>
    apiClient.get<ICategoryDto[]>(API_PATHS.categories.list, {
      params: { includeInactive },
    }),

  getById: (id: string) =>
    apiClient.get<ICategoryDto>(API_PATHS.categories.byId(id)),

  create: (data: ICreateCategoryRequest) =>
    apiClient.post<{ id: string }>(API_PATHS.categories.create, data),

  update: (id: string, data: IUpdateCategoryRequest) =>
    apiClient.put(API_PATHS.categories.update(id), data),

  delete: (id: string) => apiClient.delete(API_PATHS.categories.delete(id)),
};
