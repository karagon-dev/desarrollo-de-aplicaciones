import MuiPagination, { type PaginationProps as MuiPaginationProps } from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import { tokens } from '../../utils';

export interface PaginationProps extends Omit<MuiPaginationProps, 'onChange'> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  ...props
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        py: tokens.spacing.lg,
      }}
    >
      <MuiPagination
        page={page}
        count={totalPages}
        color="primary"
        shape="rounded"
        onChange={(_, value) => onPageChange(value)}
        aria-label="Paginación"
        {...props}
      />
    </Box>
  );
}
