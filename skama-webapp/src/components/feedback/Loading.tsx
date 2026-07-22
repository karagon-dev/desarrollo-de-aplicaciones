import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { tokens } from '../../utils';

export interface LoadingProps {
  message?: string;
  fullPage?: boolean;
}

export function Loading({ message = 'Loading...', fullPage = false }: LoadingProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy="true"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: tokens.spacing.md,
        py: fullPage ? tokens.spacing['3xl'] : tokens.spacing.xl,
        minHeight: fullPage ? '50vh' : 'auto',
      }}
    >
      <CircularProgress color="primary" aria-hidden="true" />
      <Typography sx={{ color: tokens.color.textSecondary }}>{message}</Typography>
    </Box>
  );
}
