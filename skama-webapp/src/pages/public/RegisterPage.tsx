import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      const message = 'Las contraseñas no coinciden.';
      setFormError(message);
      toast.error(message);
      return;
    }

    try {
      await register({ email, password, confirmPassword });
      toast.success('Cuenta creada. Ya puedes iniciar sesión.');
      navigate(ROUTES.login);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo completar el registro.';
      setFormError(message);
      toast.error(message);
    }
  }

  return (
    <Box sx={{ maxWidth: 440, mx: 'auto' }}>
      <PageShell
        title="Crear cuenta"
        subtitle="Únete a SKAMA Jewelry"
        breadcrumbs={[
          { label: 'Inicio', path: ROUTES.home },
          { label: 'Registro' },
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
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          {formError && (
            <Text variant="small" sx={{ color: tokens.color.danger }}>
              {formError}
            </Text>
          )}
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>
          <Text variant="small" muted sx={{ textAlign: 'center' }}>
            ¿Ya tienes cuenta?{' '}
            <Box
              component={RouterLink}
              to={ROUTES.login}
              sx={{ color: tokens.color.primary, textDecoration: 'none', fontWeight: 600 }}
            >
              Inicia sesión
            </Box>
          </Text>
        </Box>
      </Card>
    </Box>
  );
}
