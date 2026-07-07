import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { tokens } from '../../utils';

export interface AppLayoutProps {
  children: ReactNode;
  maxWidth?: number | string;
}

export function AppLayout({ children, maxWidth = 1200 }: AppLayoutProps) {
  return (
    <Box
      sx={{
        flex: 1,
        width: '100%',
        maxWidth,
        mx: 'auto',
        px: { xs: tokens.spacing.md, md: tokens.spacing.lg },
        py: { xs: tokens.spacing.lg, md: tokens.spacing.xl },
      }}
    >
      {children}
    </Box>
  );
}
