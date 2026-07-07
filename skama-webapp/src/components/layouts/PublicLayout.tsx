import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { Navbar } from '../navigation/Navbar';
import { Footer } from '../navigation/Footer';
import { AppLayout } from './AppLayout';
import { tokens } from '../../utils';

export interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
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
      <Box component="main" sx={{ flex: 1 }}>
        <AppLayout>{children}</AppLayout>
      </Box>
      <Footer />
    </Box>
  );
}
