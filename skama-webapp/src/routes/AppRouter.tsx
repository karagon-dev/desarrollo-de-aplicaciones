import { Navigate, Route, Routes } from 'react-router-dom';

import { AdminLayout, PublicLayout } from '../components/layouts';
import { GuestRoute } from '../components/routing/GuestRoute';
import { ProtectedRoute } from '../components/routing/ProtectedRoute';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { ProductManagementPage } from '../pages/admin/ProductManagementPage';
import { ReportsPage } from '../pages/admin/ReportsPage';
import { OrderDetailPage } from '../pages/customer/OrderDetailPage';
import { OrderHistoryPage } from '../pages/customer/OrderHistoryPage';
import { ProfilePage } from '../pages/customer/ProfilePage';
import { WishlistPage } from '../pages/customer/WishlistPage';
import { CartPage } from '../pages/public/CartPage';
import { CatalogPage } from '../pages/public/CatalogPage';
import { CheckoutPage } from '../pages/public/CheckoutPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { HomePage } from '../pages/public/HomePage';
import { LoginPage } from '../pages/public/LoginPage';
import { ProductDetailPage } from '../pages/public/ProductDetailPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { ResetPasswordPage } from '../pages/public/ResetPasswordPage';
import { ROUTES } from './routePaths';

function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="sk-container sk-section">
        <div className="sk-empty-state">
          <p className="sk-kicker">404</p>
          <h1>Page not found</h1>
        </div>
      </div>
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

      <Route path="/login" element={<Navigate to={ROUTES.login} replace />} />
      <Route path="/register" element={<Navigate to={ROUTES.register} replace />} />
      <Route path={ROUTES.legacyCatalog} element={<Navigate to={ROUTES.catalog} replace />} />

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
        path={ROUTES.forgotPassword}
        element={
          <GuestRoute>
            <PublicLayout>
              <ForgotPasswordPage />
            </PublicLayout>
          </GuestRoute>
        }
      />

      <Route
        path={ROUTES.resetPassword}
        element={
          <GuestRoute>
            <PublicLayout>
              <ResetPasswordPage />
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
        path="/collections/:productId"
        element={
          <PublicLayout>
            <ProductDetailPage />
          </PublicLayout>
        }
      />

      <Route path="/catalog/:productId" element={<Navigate to={ROUTES.catalog} replace />} />

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
          <PublicLayout>
            <CheckoutPage />
          </PublicLayout>
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
          <PublicLayout>
            <WishlistPage />
          </PublicLayout>
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
