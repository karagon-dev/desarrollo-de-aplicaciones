export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const API_PATHS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    userById: (id: string) => `/api/auth/users/${id}`,
    userByEmail: (email: string) =>
      `/api/auth/users/by-email/${encodeURIComponent(email)}`,
    updateStatus: (id: string) => `/api/auth/users/${id}/status`,
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
  },
  cart: {
    getOrCreate: (userId: string) => `/api/cart/user/${userId}`,
    getByUser: (userId: string) => `/api/cart/user/${userId}`,
    getById: (cartId: string) => `/api/cart/${cartId}`,
    addItem: (cartId: string) => `/api/cart/${cartId}/items`,
    updateItem: (cartItemId: string) => `/api/cart/items/${cartItemId}`,
    deleteItem: (cartItemId: string) => `/api/cart/items/${cartItemId}`,
  },
  categories: {
    list: '/api/categories',
    byId: (id: string) => `/api/categories/${id}`,
    create: '/api/categories',
    update: (id: string) => `/api/categories/${id}`,
    delete: (id: string) => `/api/categories/${id}`,
  },
  clients: {
    profile: (userId: string) => `/api/clients/${userId}/profile`,
  },
  dashboard: {
    summary: '/api/dashboard/summary',
  },
  inventory: {
    movements: '/api/inventory/movements',
    movementsByProduct: (productId: string) =>
      `/api/inventory/movements/product/${productId}`,
    lowStock: '/api/inventory/low-stock',
  },
  notifications: {
    pending: '/api/notifications/pending',
    create: '/api/notifications',
    markSent: (id: string) => `/api/notifications/${id}/sent`,
    markFailed: (id: string) => `/api/notifications/${id}/failed`,
  },
  orders: {
    fromCart: (cartId: string) => `/api/orders/from-cart/${cartId}`,
    byId: (orderId: string) => `/api/orders/${orderId}`,
    byUser: (userId: string) => `/api/orders/user/${userId}`,
    detail: (orderId: string) => `/api/orders/${orderId}/detail`,
    updateStatus: (orderId: string) => `/api/orders/${orderId}/status`,
    cancel: (orderId: string) => `/api/orders/${orderId}/cancel`,
  },
  productImages: {
    list: (productId: string) => `/api/products/${productId}/images`,
    upload: (productId: string) => `/api/products/${productId}/images`,
    update: (id: string) => `/api/product-images/${id}`,
    delete: (id: string) => `/api/product-images/${id}`,
    setMain: (id: string) => `/api/product-images/${id}/main`,
  },
  products: {
    list: '/api/products',
    byId: (id: string) => `/api/products/${id}`,
    create: '/api/products',
    update: (id: string) => `/api/products/${id}`,
    delete: (id: string) => `/api/products/${id}`,
  },
  promotions: {
    active: '/api/promotions/active',
    create: '/api/promotions',
    update: (id: string) => `/api/promotions/${id}`,
    assignProduct: (promotionId: string, productId: string) =>
      `/api/promotions/${promotionId}/products/${productId}`,
    removeProduct: (promotionId: string, productId: string) =>
      `/api/promotions/${promotionId}/products/${productId}`,
  },
  reports: {
    salesByPeriod: '/api/reports/sales-by-period',
    salesByProduct: '/api/reports/sales-by-product',
    topProducts: '/api/reports/top-products',
  },
  reviews: {
    byProduct: (productId: string) => `/api/reviews/product/${productId}`,
    byUser: (userId: string) => `/api/reviews/user/${userId}`,
    create: '/api/reviews',
  },
  wishlist: {
    byUser: (userId: string) => `/api/wishlist/user/${userId}`,
    add: (userId: string) => `/api/wishlist/user/${userId}`,
    remove: (userId: string, productId: string) =>
      `/api/wishlist/user/${userId}/product/${productId}`,
    toggle: (userId: string) => `/api/wishlist/user/${userId}/toggle`,
  },
} as const;
