import Box from '@mui/material/Box';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import Typography from '@mui/material/Typography';
import { tokens } from '../../utils';
import { Button } from '../buttons';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No hay datos',
  description = 'Aún no hay información para mostrar.',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
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
      <InboxOutlinedIcon
        sx={{ fontSize: 48, color: tokens.color.muted }}
        aria-hidden="true"
      />
      <Typography variant="h6" sx={{ color: tokens.color.textPrimary }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: tokens.color.textSecondary, maxWidth: 400 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
