import type {
  IForgotPasswordRequest,
  IForgotPasswordResponse,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
  IResetPasswordRequest,
  IUpdateUserStatusRequest,
  IUserDto,
} from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const authService = {
  register: (data: IRegisterRequest) =>
    apiClient.post<IRegisterResponse>(API_PATHS.auth.register, data),

  login: (data: ILoginRequest) =>
    apiClient.post<ILoginResponse>(API_PATHS.auth.login, data),

  getUserById: (id: string) =>
    apiClient.get<IUserDto>(API_PATHS.auth.userById(id)),

  getUserByEmail: (email: string) =>
    apiClient.get<IUserDto>(API_PATHS.auth.userByEmail(email)),

  updateUserStatus: (id: string, data: IUpdateUserStatusRequest) =>
    apiClient.patch(API_PATHS.auth.updateStatus(id), data),

  forgotPassword: (data: IForgotPasswordRequest) =>
    apiClient.post<IForgotPasswordResponse>(
      API_PATHS.auth.forgotPassword,
      data,
    ),

  resetPassword: (data: IResetPasswordRequest) =>
    apiClient.post(API_PATHS.auth.resetPassword, data),
};
