import { useState } from 'react';

import { Link as RouterLink, useLocation } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';

import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';

import Typography from '@mui/material/Typography';

import Drawer from '@mui/material/Drawer';

import List from '@mui/material/List';

import ListItemButton from '@mui/material/ListItemButton';

import ListItemText from '@mui/material/ListItemText';

import MenuIcon from '@mui/icons-material/Menu';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { Button } from '../buttons';

import { Badge } from '../feedback';

import { useAuth, useCart, useThemeMode } from '../../hooks';

import { tokens } from '../../utils';

import { ROUTES } from '../../routes/routePaths';



const navLinks = [

  { label: 'Inicio', path: ROUTES.home },

  { label: 'Catálogo', path: ROUTES.catalog },

  { label: 'Carrito', path: ROUTES.cart },

];



export function Navbar() {

  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  const { mode, toggleMode } = useThemeMode();

  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();



  const drawer = (

    <Box sx={{ width: 260, pt: tokens.spacing.md }} role="navigation" aria-label="Menú principal">

      <List>

        {navLinks.map((link) => (

          <ListItemButton

            key={link.path}

            component={RouterLink}

            to={link.path}

            selected={location.pathname === link.path}

            onClick={() => setMobileOpen(false)}

          >

            <ListItemText primary={link.label} />

          </ListItemButton>

        ))}

        {isAuthenticated && (

          <>

            <ListItemButton component={RouterLink} to={ROUTES.wishlist} onClick={() => setMobileOpen(false)}>

              <ListItemText primary="Favoritos" />

            </ListItemButton>

            <ListItemButton component={RouterLink} to={ROUTES.profile} onClick={() => setMobileOpen(false)}>

              <ListItemText primary="Mi perfil" />

            </ListItemButton>

            <ListItemButton component={RouterLink} to={ROUTES.orderHistory} onClick={() => setMobileOpen(false)}>

              <ListItemText primary="Mis pedidos" />

            </ListItemButton>

          </>

        )}

        {isAdmin && (

          <ListItemButton component={RouterLink} to={ROUTES.admin.dashboard} onClick={() => setMobileOpen(false)}>

            <ListItemText primary="Administración" />

          </ListItemButton>

        )}

        {isAuthenticated ? (

          <ListItemButton

            onClick={() => {

              logout();

              setMobileOpen(false);

            }}

          >

            <ListItemText primary="Cerrar sesión" />

          </ListItemButton>

        ) : (

          <ListItemButton component={RouterLink} to={ROUTES.login} onClick={() => setMobileOpen(false)}>

            <ListItemText primary="Ingresar" />

          </ListItemButton>

        )}

      </List>

    </Box>

  );



  return (

    <>

      <AppBar

        position="sticky"

        elevation={0}

        sx={{

          backgroundColor: tokens.color.surface,

          borderBottom: `1px solid ${tokens.color.border}`,

          color: tokens.color.textPrimary,

        }}

      >

        <Toolbar sx={{ gap: tokens.spacing.md, minHeight: { xs: 56, md: 64 } }}>

          <IconButton

            edge="start"

            aria-label="Abrir menú"

            onClick={() => setMobileOpen(true)}

            sx={{ display: { md: 'none' }, color: tokens.color.textPrimary }}

          >

            <MenuIcon />

          </IconButton>



          <Typography

            component={RouterLink}

            to={ROUTES.home}

            variant="h6"

            sx={{

              flexGrow: { xs: 1, md: 0 },

              mr: { md: tokens.spacing.xl },

              fontFamily: '"Playfair Display", Georgia, serif',

              fontWeight: 700,

              color: tokens.color.primary,

              textDecoration: 'none',

              letterSpacing: '0.02em',

            }}

          >

            SKAMA

          </Typography>



          <Box

            component="nav"

            aria-label="Navegación principal"

            sx={{ display: { xs: 'none', md: 'flex' }, gap: tokens.spacing.sm, flex: 1 }}

          >

            {navLinks.map((link) => (

              <Button

                key={link.path}

                component={RouterLink}

                to={link.path}

                variant={location.pathname === link.path ? 'primary' : 'ghost'}

                size="sm"

              >

                {link.label}

              </Button>

            ))}

            {isAdmin && (

              <Button

                component={RouterLink}

                to={ROUTES.admin.dashboard}

                variant={location.pathname.startsWith('/admin') ? 'primary' : 'ghost'}

                size="sm"

              >

                Admin

              </Button>

            )}

          </Box>



          <Box sx={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>

            <IconButton

              aria-label={mode === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}

              onClick={toggleMode}

              sx={{ color: tokens.color.textSecondary }}

            >

              {mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}

            </IconButton>



            {isAuthenticated && (

              <IconButton

                component={RouterLink}

                to={ROUTES.wishlist}

                aria-label="Favoritos"

                sx={{ color: tokens.color.textSecondary }}

              >

                <FavoriteBorderIcon />

              </IconButton>

            )}



            <IconButton

              component={RouterLink}

              to={ROUTES.cart}

              aria-label="Carrito"

              sx={{ color: tokens.color.textSecondary }}

            >

              <Badge badgeContent={itemCount} color="primary">

                <ShoppingCartOutlinedIcon />

              </Badge>

            </IconButton>



            {isAuthenticated ? (

              <>

                <Button

                  component={RouterLink}

                  to={ROUTES.profile}

                  variant="outline"

                  size="sm"

                  sx={{ display: { xs: 'none', sm: 'inline-flex' }, ml: tokens.spacing.sm }}

                >

                  {user?.email.split('@')[0]}

                </Button>

                <IconButton

                  aria-label="Cerrar sesión"

                  onClick={logout}

                  sx={{ color: tokens.color.textSecondary }}

                >

                  <LogoutOutlinedIcon />

                </IconButton>

              </>

            ) : (

              <Button

                component={RouterLink}

                to={ROUTES.login}

                variant="outline"

                size="sm"

                sx={{ display: { xs: 'none', sm: 'inline-flex' }, ml: tokens.spacing.sm }}

              >

                Ingresar

              </Button>

            )}

          </Box>

        </Toolbar>

      </AppBar>



      <Drawer

        anchor="left"

        open={mobileOpen}

        onClose={() => setMobileOpen(false)}

        ModalProps={{ keepMounted: true }}

        sx={{ display: { md: 'none' } }}

      >

        {drawer}

      </Drawer>

    </>

  );

}

