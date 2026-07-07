import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { tokens } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

const footerLinks = [
  { label: 'Catálogo', path: ROUTES.catalog },
  { label: 'Mi perfil', path: ROUTES.profile },
  { label: 'Pedidos', path: ROUTES.orderHistory },
  { label: 'Admin', path: ROUTES.admin.dashboard },
];

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        borderTop: `1px solid ${tokens.color.border}`,
        backgroundColor: tokens.color.surface,
        py: tokens.spacing.xl,
        px: tokens.spacing.lg,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: tokens.spacing.lg,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: tokens.color.primary,
              fontWeight: 700,
              mb: tokens.spacing.xs,
            }}
          >
            SKAMA Jewelry
          </Typography>
          <Typography variant="body2" sx={{ color: tokens.color.textSecondary, maxWidth: 320 }}>
            Joyería con esmeralda colombiana. Elegancia, calidad y diseño atemporal.
          </Typography>
        </Box>

        <Box
          component="nav"
          aria-label="Enlaces del pie de página"
          sx={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacing.md }}
        >
          {footerLinks.map((link) => (
            <Typography
              key={link.path}
              component={RouterLink}
              to={link.path}
              variant="body2"
              sx={{
                color: tokens.color.textSecondary,
                textDecoration: 'none',
                '&:hover': { color: tokens.color.primary },
              }}
            >
              {link.label}
            </Typography>
          ))}
        </Box>
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          mt: tokens.spacing.lg,
          color: tokens.color.muted,
        }}
      >
        © {new Date().getFullYear()} SKAMA Jewelry. Todos los derechos reservados.
      </Typography>
    </Box>
  );
}
