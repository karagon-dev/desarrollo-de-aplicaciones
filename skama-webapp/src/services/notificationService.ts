import type {
  ICreateNotificationRequest,
  ICreateNotificationResponse,
  INotificationDto,
} from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const notificationService = {
  getPending: () =>
    apiClient.get<INotificationDto[]>(API_PATHS.notifications.pending),

  create: (data: ICreateNotificationRequest) =>
    apiClient.post<ICreateNotificationResponse>(
      API_PATHS.notifications.create,
      data,
    ),

  markSent: (id: string) =>
    apiClient.patch(API_PATHS.notifications.markSent(id)),

  markFailed: (id: string) =>
    apiClient.patch(API_PATHS.notifications.markFailed(id)),
};
