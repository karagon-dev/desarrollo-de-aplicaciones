import MuiModal, { type ModalProps as MuiModalProps } from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '../../utils';

export interface ModalProps extends MuiModalProps {
  title?: string;
  onClose: () => void;
}

export function Modal({ title, children, onClose, ...props }: ModalProps) {
  return (
    <MuiModal onClose={onClose} {...props}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92%', sm: 480 },
          maxHeight: '90vh',
          overflow: 'auto',
          backgroundColor: tokens.color.surface,
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadow.lg,
          border: `1px solid ${tokens.color.border}`,
          p: tokens.spacing.lg,
        }}
      >
        {title && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: tokens.spacing.md,
            }}
          >
            <Typography variant="h6" sx={{ color: tokens.color.textPrimary }}>
              {title}
            </Typography>
            <IconButton aria-label="Close" onClick={onClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        {children}
      </Box>
    </MuiModal>
  );
}
