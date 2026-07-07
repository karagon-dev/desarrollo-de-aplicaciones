import type {
  ICreateOrderRequest,
  ICreateOrderResponse,
  IOrderDetailDto,
  IOrderDto,
  IUpdateOrderStatusRequest,
} from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const orderService = {
  createFromCart: (cartId: string, data: ICreateOrderRequest) =>
    apiClient.post<ICreateOrderResponse>(
      API_PATHS.orders.fromCart(cartId),
      data,
    ),

  getById: (orderId: string) =>
    apiClient.get<IOrderDto>(API_PATHS.orders.byId(orderId)),

  getByUser: (userId: string) =>
    apiClient.get<IOrderDto[]>(API_PATHS.orders.byUser(userId)),

  getDetail: (orderId: string) =>
    apiClient.get<IOrderDetailDto>(API_PATHS.orders.detail(orderId)),

  updateStatus: (orderId: string, data: IUpdateOrderStatusRequest) =>
    apiClient.patch(API_PATHS.orders.updateStatus(orderId), data),

  cancel: (orderId: string) =>
    apiClient.post(API_PATHS.orders.cancel(orderId)),
};
