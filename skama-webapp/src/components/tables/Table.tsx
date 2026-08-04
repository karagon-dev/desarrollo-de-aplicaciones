import type { ReactNode } from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { tokens } from '../../utils';

export interface TableColumn<T> {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => ReactNode;
  accessor?: keyof T;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  rows,
  getRowId,
  emptyMessage = 'Sin registros',
}: TableProps<T>) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: `1px solid ${tokens.color.border}`,
        borderRadius: tokens.radius.md,
        backgroundColor: tokens.color.surface,
      }}
    >
      <MuiTable aria-label="Tabla de datos">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align ?? 'left'}
                sx={{
                  fontWeight: 600,
                  color: tokens.color.textSecondary,
                  backgroundColor: tokens.color.surfaceSecondary,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{ color: tokens.color.muted, py: tokens.spacing.xl }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={getRowId(row)} hover>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align ?? 'left'}
                    sx={{ color: tokens.color.textPrimary }}
                  >
                    {column.render
                      ? column.render(row)
                      : column.accessor
                        ? String(row[column.accessor] ?? '')
                        : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
