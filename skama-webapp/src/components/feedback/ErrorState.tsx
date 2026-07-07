import Box from '@mui/material/Box';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import Typography from '@mui/material/Typography';
import { tokens } from '../../utils';
import { Button } from '../buttons';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Algo salió mal',
  description = 'No pudimos cargar la información. Intenta de nuevo.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Box
      role="alert"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: tokens.spacing['3xl'],
        px: tokens.spacing.lg,
        gap: tokens.spacing.md,
      }}
    >
      <ReportProblemOutlinedIcon
        sx={{ fontSize: 48, color: tokens.color.danger }}
        aria-hidden="true"
      />
      <Typography variant="h6" sx={{ color: tokens.color.textPrimary }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: tokens.color.textSecondary, maxWidth: 400 }}>
        {description}
      </Typography>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </Box>
  );
}
