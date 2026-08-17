import type { KeyboardEvent } from 'react';
import { Card } from '../cards';
import { Text } from '../typography';
import { tokens } from '../../utils';

export interface StatCardProps {
  label: string;
  value: string;
  helperText?: string;
  onClick?: () => void;
}

export function StatCard({ label, value, helperText, onClick }: StatCardProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!onClick || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    onClick();
  }

  return (
    <Card
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': onClick
          ? {
              borderColor: tokens.color.primary,
              boxShadow: tokens.shadow.sm,
            }
          : undefined,
        '&:focus-visible': onClick
          ? {
              outline: `2px solid ${tokens.color.primary}`,
              outlineOffset: 2,
            }
          : undefined,
      }}
    >
      <Text variant="small" muted>
        {label}
      </Text>
      <Text variant="h2" sx={{ color: tokens.color.primary, mt: tokens.spacing.sm }}>
        {value}
      </Text>
      {helperText && (
        <Text variant="small" muted sx={{ mt: tokens.spacing.xs }}>
          {helperText}
        </Text>
      )}
    </Card>
  );
}
