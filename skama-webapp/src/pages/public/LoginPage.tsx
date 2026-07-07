import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import { PageShell } from '../../components/layouts/PageShell';
import { Card } from '../../components/cards';
import { Input } from '../../components/inputs';
import { Button } from '../../components/buttons';
import { Text } from '../../components/typography';
import { useAuth } from '../../hooks';
import { tokens } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const from =
    (location.state as { from?: string } | null)?.from ?? ROUTES.home;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    try {
      await login({ email, password });
      toast.success('Sesión iniciada correctamente.');
      navigate(from, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo iniciar sesión.';
      setFormError(message);
      toast.error(message);
    }
  }

  return (
    <Box sx={{ maxWidth: 440, mx: 'auto' }}>
      <PageShell
        title="Iniciar sesión"
        subtitle="Accede a tu cuenta SKAMA"
        breadcrumbs={[
          { label: 'Inicio', path: ROUTES.home },
          { label: 'Iniciar sesión' },
        ]}
      />
      <Card>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}
        >
          <Input
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {formError && (
            <Text variant="small" sx={{ color: tokens.color.danger }}>
              {formError}
            </Text>
          )}
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </Button>
          <Text variant="small" muted sx={{ textAlign: 'center' }}>
            ¿No tienes cuenta?{' '}
            <Box
              component={RouterLink}
              to={ROUTES.register}
              sx={{ color: tokens.color.primary, textDecoration: 'none', fontWeight: 600 }}
            >
              Regístrate
            </Box>
          </Text>
        </Box>
      </Card>
    </Box>
  );
}
