export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  catalog: '/catalog',
  productDetail: (id: string) => `/catalog/${id}`,
  cart: '/cart',
  checkout: '/checkout',
  profile: '/profile',
  orderHistory: '/orders',
  orderDetail: (id: string) => `/orders/${id}`,
  wishlist: '/wishlist',
  admin: {
    root: '/admin',
    dashboard: '/admin',
    products: '/admin/products',
    reports: '/admin/reports',
  },
} as const;
