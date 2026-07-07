import type {
  IClientProfileDto,
  IUpsertClientProfileRequest,
  IUpsertClientProfileResponse,
} from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const clientService = {
  getProfile: (userId: string) =>
    apiClient.get<IClientProfileDto>(API_PATHS.clients.profile(userId)),

  upsertProfile: (userId: string, data: IUpsertClientProfileRequest) =>
    apiClient.put<IUpsertClientProfileResponse>(
      API_PATHS.clients.profile(userId),
      data,
    ),
};
