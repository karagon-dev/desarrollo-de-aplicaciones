import type {
  IInventoryMovementDto,
  IInventoryMovementRequest,
  ILowStockProductDto,
} from '../types';
import { apiClient } from './apiClient';
import { API_PATHS } from './apiPaths';

export const inventoryService = {
  createMovement: (data: IInventoryMovementRequest) =>
    apiClient.post<{ id: string }>(API_PATHS.inventory.movements, data),

  getMovementsByProduct: (productId: string) =>
    apiClient.get<IInventoryMovementDto[]>(
      API_PATHS.inventory.movementsByProduct(productId),
    ),

  getLowStock: () =>
    apiClient.get<ILowStockProductDto[]>(API_PATHS.inventory.lowStock),
};
