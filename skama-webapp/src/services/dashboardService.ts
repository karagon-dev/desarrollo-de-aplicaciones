import type { IDashboardSummaryDto, IDateRangeParams } from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const dashboardService = {
  getSummary: (params: IDateRangeParams) =>
    apiClient.get<IDashboardSummaryDto>(API_PATHS.dashboard.summary, {
      params,
    }),
};
