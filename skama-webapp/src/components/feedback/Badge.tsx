import MuiBadge, { type BadgeProps as MuiBadgeProps } from '@mui/material/Badge';

export type BadgeProps = MuiBadgeProps;

export function Badge(props: BadgeProps) {
  return <MuiBadge color="primary" {...props} />;
}
