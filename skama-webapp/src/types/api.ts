export interface IProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
}

export interface IUserSession {
  userId: string;
  email: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IRegisterResponse {
  userId: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  userId: string;
  email: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
}

export interface IUserDto {
  id: string;
  roleId: number;
  roleName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface IUpdateUserStatusRequest {
  isActive: boolean;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IForgotPasswordResponse {
  message: string;
  resetToken?: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ICartSummaryResponse {
  cartId: string;
}

export interface ICartDto {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ICartItemDto {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface ICartDetailDto extends ICartDto {
  total: number;
  items: ICartItemDto[];
}

export interface IAddCartItemRequest {
  productId: string;
  quantity: number;
}

export interface IAddCartItemResponse {
  cartItemId: string;
}

export interface IUpdateCartItemRequest {
  quantity: number;
}

export interface ICategoryDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ICreateCategoryRequest {
  name: string;
  description: string;
}

export interface IUpdateCategoryRequest {
  name: string;
  description: string;
  isActive: boolean;
}

export interface IClientProfileDto {
  id: string;
  userId: string;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface IUpsertClientProfileRequest {
  identificationNumber: string;
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  phone?: string | null;
}

export interface IUpsertClientProfileResponse {
  profileId: string;
}

export interface ITopProductSummary {
  productId: string;
  productName: string;
  totalQuantitySold: number;
  totalSales: number;
}

export interface IDashboardSummaryDto {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  registeredCustomers: number;
  lowStockProducts: number;
  topProducts: ITopProductSummary[];
}

export interface IInventoryMovementRequest {
  productId: string;
  movementType: 'SALE' | 'RETURN' | 'MANUAL_ADJUSTMENT';
  quantity: number;
  referenceOrderId: string | null;
}

export interface IInventoryMovementDto {
  id: string;
  productId: string;
  movementType: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceOrderId: string | null;
  createdAt: string;
}

export interface ILowStockProductDto {
  id: string;
  name: string;
  stockQuantity: number;
  minimumStock: number;
  isActive: boolean;
}

export interface INotificationDto {
  id: string;
  userId: string;
  orderId: string;
  type: string;
  recipientEmail: string;
  subject: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
}

export interface ICreateNotificationRequest {
  userId: string;
  orderId: string;
  type: string;
  recipientEmail: string;
  subject: string;
}

export interface ICreateNotificationResponse {
  id: string;
}

export interface ICreateOrderRequest {
  paymentMethod: string;
  shippingAddress: string;
}

export interface ICreateOrderResponse {
  orderId: string;
  orderNumber: string;
}

export interface IOrderDto {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  subtotal: number;
  discountTotal: number;
  total: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface IOrderItemDto {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
}

export interface IOrderDetailDto extends IOrderDto {
  items: IOrderItemDto[];
}

export interface IUpdateOrderStatusRequest {
  status: string;
}

export interface IProductImageDto {
  id: string;
  productId: string;
  imageName: string;
  imageUrl: string;
  isMain: boolean;
  createdAt: string | null;
}

export interface IProductDto {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  minimumStock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ICreateProductRequest {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  minimumStock: number;
}

export interface IUpdateProductRequest {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  minimumStock: number;
  isActive: boolean;
}

export interface ICreateProductResponse {
  id: string;
}

export interface IPromotionDto {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ICreatePromotionRequest {
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

export interface IUpdatePromotionRequest {
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ISalesByPeriodDto {
  saleDate: string;
  orderCount: number;
  subtotal: number;
  discountTotal: number;
  total: number;
}

export interface ISalesByProductDto {
  productId: string;
  productName: string;
  totalQuantitySold: number;
  totalSales: number;
}

export interface IReviewDto {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ICreateReviewRequest {
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
}

export interface ICreateReviewResponse {
  reviewId: string;
}

export interface IWishlistItemDto {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
}

export interface IAddWishlistItemRequest {
  productId: string;
}

export interface IAddWishlistItemResponse {
  id: string;
}

export interface IToggleWishlistRequest {
  productId: string;
}

export interface IToggleWishlistResponse {
  isFavorite: boolean;
}

export interface IProductFilters {
  search?: string;
  categoryId?: string;
  includeInactive?: boolean;
}

export interface IDateRangeParams {
  startDate: string;
  endDate: string;
}

export interface ITopProductsParams extends IDateRangeParams {
  top?: number;
}
