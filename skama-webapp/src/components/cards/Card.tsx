import MuiCard, { type CardProps as MuiCardProps } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { tokens } from '../../utils';

export interface CardProps extends MuiCardProps {
  padding?: boolean;
}

export function Card({ padding = true, children, sx, ...props }: CardProps) {
  return (
    <MuiCard
      sx={{
        backgroundColor: tokens.color.surface,
        borderColor: tokens.color.border,
        ...sx,
      }}
      {...props}
    >
      {padding ? <CardContent>{children}</CardContent> : children}
    </MuiCard>
  );
}
