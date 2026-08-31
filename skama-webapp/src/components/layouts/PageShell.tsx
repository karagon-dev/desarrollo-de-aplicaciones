import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumb, type BreadcrumbItem } from '../navigation';
import { SectionTitle } from '../typography';
import { Chip } from '../feedback';
import { tokens } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

export interface PageShellProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  badge?: string;
  children?: ReactNode;
}

export function PageShell({
  title,
  subtitle,
  breadcrumbs,
  badge,
  children,
}: PageShellProps) {
  const { pathname } = useLocation();
  const isAdminPage = pathname === ROUTES.admin.root || pathname.startsWith(`${ROUTES.admin.root}/`);

  return (
    <Box
      className={isAdminPage ? undefined : 'sk-container'}
      sx={{
        width: isAdminPage ? '100%' : undefined,
        py: { xs: tokens.spacing.md, md: tokens.spacing.lg },
        pb: { xs: tokens.spacing.lg, md: tokens.spacing.xl },
      }}
    >
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: tokens.spacing.md, mb: tokens.spacing.lg }}>
        <Box sx={{ flex: 1 }}>
          <SectionTitle title={title} subtitle={subtitle} />
        </Box>
        {badge && <Chip label={badge} chipVariant="primary" />}
      </Box>
      {children}
    </Box>
  );
}
