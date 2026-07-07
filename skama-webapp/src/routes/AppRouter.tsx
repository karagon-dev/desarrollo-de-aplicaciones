import { Route, Routes } from 'react-router-dom';

import { PublicLayout, AdminLayout } from '../components/layouts';

import { ProtectedRoute } from '../components/routing/ProtectedRoute';

import { GuestRoute } from '../components/routing/GuestRoute';

import { ROUTES } from './routePaths';

import { HomePage } from '../pages/public/HomePage';

import { LoginPage } from '../pages/public/LoginPage';

import { RegisterPage } from '../pages/public/RegisterPage';

import { CatalogPage } from '../pages/public/CatalogPage';

import { ProductDetailPage } from '../pages/public/ProductDetailPage';

import { CartPage } from '../pages/public/CartPage';

import { CheckoutPage } from '../pages/public/CheckoutPage';

import { ProfilePage } from '../pages/customer/ProfilePage';

import { OrderHistoryPage } from '../pages/customer/OrderHistoryPage';
import { OrderDetailPage } from '../pages/customer/OrderDetailPage';

import { WishlistPage } from '../pages/customer/WishlistPage';

import { DashboardPage } from '../pages/admin/DashboardPage';

import { ProductManagementPage } from '../pages/admin/ProductManagementPage';

import { ReportsPage } from '../pages/admin/ReportsPage';



function NotFoundPage() {

  return (

    <PublicLayout>

      <div>Página no encontrada</div>

    </PublicLayout>

  );

}



export function AppRouter() {

  return (

    <Routes>

      <Route

        path={ROUTES.home}

        element={

          <PublicLayout>

            <HomePage />

          </PublicLayout>

        }

      />

      <Route

        path={ROUTES.login}

        element={

          <GuestRoute>

            <PublicLayout>

              <LoginPage />

            </PublicLayout>

          </GuestRoute>

        }

      />

      <Route

        path={ROUTES.register}

        element={

          <GuestRoute>

            <PublicLayout>

              <RegisterPage />

            </PublicLayout>

          </GuestRoute>

        }

      />

      <Route

        path={ROUTES.catalog}

        element={

          <PublicLayout>

            <CatalogPage />

          </PublicLayout>

        }

      />

      <Route

        path="/catalog/:productId"

        element={

          <PublicLayout>

            <ProductDetailPage />

          </PublicLayout>

        }

      />

      <Route

        path={ROUTES.cart}

        element={

          <PublicLayout>

            <CartPage />

          </PublicLayout>

        }

      />

      <Route

        path={ROUTES.checkout}

        element={

          <ProtectedRoute>

            <PublicLayout>

              <CheckoutPage />

            </PublicLayout>

          </ProtectedRoute>

        }

      />

      <Route

        path={ROUTES.profile}

        element={

          <ProtectedRoute>

            <PublicLayout>

              <ProfilePage />

            </PublicLayout>

          </ProtectedRoute>

        }

      />

      <Route

        path={ROUTES.orderHistory}

        element={

          <ProtectedRoute>

            <PublicLayout>

              <OrderHistoryPage />

            </PublicLayout>

          </ProtectedRoute>

        }

      />

      <Route

        path="/orders/:orderId"

        element={

          <ProtectedRoute>

            <PublicLayout>

              <OrderDetailPage />

            </PublicLayout>

          </ProtectedRoute>

        }

      />

      <Route

        path={ROUTES.wishlist}

        element={

          <ProtectedRoute>

            <PublicLayout>

              <WishlistPage />

            </PublicLayout>

          </ProtectedRoute>

        }

      />

      <Route

        path={ROUTES.admin.dashboard}

        element={

          <ProtectedRoute requireAdmin>

            <AdminLayout>

              <DashboardPage />

            </AdminLayout>

          </ProtectedRoute>

        }

      />

      <Route

        path={ROUTES.admin.products}

        element={

          <ProtectedRoute requireAdmin>

            <AdminLayout>

              <ProductManagementPage />

            </AdminLayout>

          </ProtectedRoute>

        }

      />

      <Route

        path={ROUTES.admin.reports}

        element={

          <ProtectedRoute requireAdmin>

            <AdminLayout>

              <ReportsPage />

            </AdminLayout>

          </ProtectedRoute>

        }

      />

      <Route path="*" element={<NotFoundPage />} />

    </Routes>

  );

}

