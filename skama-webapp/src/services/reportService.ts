import type {
  IDateRangeParams,
  ISalesByPeriodDto,
  ISalesByProductDto,
  ITopProductSummary,
  ITopProductsParams,
} from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const reportService = {
  getSalesByPeriod: (params: IDateRangeParams) =>
    apiClient.get<ISalesByPeriodDto[]>(API_PATHS.reports.salesByPeriod, {
      params,
    }),

  getSalesByProduct: (params: IDateRangeParams) =>
    apiClient.get<ISalesByProductDto[]>(API_PATHS.reports.salesByProduct, {
      params,
    }),

  getTopProducts: (params: ITopProductsParams) =>
    apiClient.get<ITopProductSummary[]>(API_PATHS.reports.topProducts, {
      params,
    }),
};
