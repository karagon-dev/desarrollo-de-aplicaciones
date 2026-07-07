import type { IProductImageDto } from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export interface IUploadProductImageParams {
  file: File;
  isMain?: boolean;
  altText?: string;
  sortOrder?: number;
}

export const productImageService = {
  list: (productId: string) =>
    apiClient.get<IProductImageDto[]>(API_PATHS.productImages.list(productId)),

  upload: (productId: string, params: IUploadProductImageParams) => {
    const formData = new FormData();
    formData.append('file', params.file);
    if (params.isMain !== undefined) {
      formData.append('isMain', String(params.isMain));
    }
    if (params.altText) {
      formData.append('altText', params.altText);
    }
    if (params.sortOrder !== undefined) {
      formData.append('sortOrder', String(params.sortOrder));
    }
    return apiClient.post<IProductImageDto>(
      API_PATHS.productImages.upload(productId),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  update: (id: string, params: Partial<IUploadProductImageParams>) => {
    const formData = new FormData();
    if (params.file) {
      formData.append('file', params.file);
    }
    if (params.isMain !== undefined) {
      formData.append('isMain', String(params.isMain));
    }
    if (params.altText) {
      formData.append('altText', params.altText);
    }
    if (params.sortOrder !== undefined) {
      formData.append('sortOrder', String(params.sortOrder));
    }
    return apiClient.put<IProductImageDto>(
      API_PATHS.productImages.update(id),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  delete: (id: string) => apiClient.delete(API_PATHS.productImages.delete(id)),

  setMain: (id: string) => apiClient.patch(API_PATHS.productImages.setMain(id)),
};
