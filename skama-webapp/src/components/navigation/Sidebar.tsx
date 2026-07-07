import { Link as RouterLink, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { tokens } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

const adminLinks = [
  { label: 'Dashboard', path: ROUTES.admin.dashboard, icon: DashboardOutlinedIcon },
  { label: 'Productos', path: ROUTES.admin.products, icon: Inventory2OutlinedIcon },
  { label: 'Reportes', path: ROUTES.admin.reports, icon: AssessmentOutlinedIcon },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <Box
      component="aside"
      aria-label="Navegación de administración"
      sx={{
        width: { xs: '100%', md: 240 },
        flexShrink: 0,
        backgroundColor: tokens.color.surface,
        borderRight: { md: `1px solid ${tokens.color.border}` },
        borderBottom: { xs: `1px solid ${tokens.color.border}`, md: 'none' },
        py: tokens.spacing.md,
      }}
    >
      <Typography
        variant="overline"
        sx={{
          px: tokens.spacing.lg,
          mb: tokens.spacing.sm,
          display: 'block',
          color: tokens.color.muted,
          letterSpacing: '0.1em',
        }}
      >
        Administración
      </Typography>
      <List dense>
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <ListItemButton
              key={link.path}
              component={RouterLink}
              to={link.path}
              selected={isActive}
              sx={{
                mx: tokens.spacing.sm,
                borderRadius: tokens.radius.md,
                '&.Mui-selected': {
                  backgroundColor: tokens.color.primarySoft,
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: tokens.color.primary,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: tokens.color.textSecondary }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 400,
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
