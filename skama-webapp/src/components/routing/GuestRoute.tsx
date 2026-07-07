import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';

interface IGuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: IGuestRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? ROUTES.admin.dashboard : ROUTES.home} replace />;
  }

  return children;
}
