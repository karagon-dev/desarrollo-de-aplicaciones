import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { Navbar } from '../navigation/Navbar';
import { Sidebar } from '../navigation/Sidebar';
import { AppLayout } from './AppLayout';
import { tokens } from '../../utils';

export interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: tokens.color.background,
      }}
    >
      <Navbar />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Sidebar />
        <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
          <AppLayout maxWidth={1400}>{children}</AppLayout>
        </Box>
      </Box>
    </Box>
  );
}
