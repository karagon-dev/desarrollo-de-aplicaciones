import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { Breadcrumb, type BreadcrumbItem } from '../navigation';
import { SectionTitle } from '../typography';
import { Chip } from '../feedback';
import { tokens } from '../../utils';

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
  return (
    <Box>
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
