import { Link as RouterLink } from 'react-router-dom';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { tokens } from '../../utils';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <MuiBreadcrumbs
      aria-label="Navigation path"
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: tokens.spacing.lg }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast || !item.path) {
          return (
            <Typography
              key={item.label}
              color="text.primary"
              sx={{ color: tokens.color.textPrimary, fontWeight: isLast ? 600 : 400 }}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Typography
            key={item.label}
            component={RouterLink}
            to={item.path}
            sx={{
              color: tokens.color.textSecondary,
              textDecoration: 'none',
              '&:hover': { color: tokens.color.primary },
            }}
          >
            {item.label}
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
}
