import type { ReactNode } from 'react';
import MuiDialog, { type DialogProps as MuiDialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '../../utils';

export interface DialogProps extends MuiDialogProps {
  title?: string;
  actions?: ReactNode;
  onClose?: () => void;
}

export function Dialog({
  title,
  actions,
  children,
  onClose,
  ...props
}: DialogProps) {
  return (
    <MuiDialog
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: tokens.color.surface,
            borderRadius: tokens.radius.lg,
          },
        },
      }}
      {...props}
    >
      {title && (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: tokens.color.textPrimary,
          }}
        >
          {title}
          {onClose && (
            <IconButton aria-label="Close" onClick={onClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent sx={{ color: tokens.color.textSecondary }}>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </MuiDialog>
  );
}
