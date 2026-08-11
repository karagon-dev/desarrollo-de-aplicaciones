import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { useAuth } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <section className="sk-auth-shell sk-auth-shell--brand sk-auth-shell--register" aria-labelledby="register-title">
      <div className="sk-auth-intro sk-auth-intro--brand">
        <p className="sk-auth-wordmark">SKAMA</p>
        <h1 id="register-title">Crea tu lugar en el mundo SKAMA.</h1>
        <p className="sk-lede">
          Regístrate y comienza a vivir la experiencia SKAMA Jewelry. Guarda tus piezas favoritas, realiza
          compras de forma segura y descubre colecciones inspiradas en la elegancia de las esmeraldas y el
          lujo atemporal.
        </p>
      </div>

      <div className="sk-auth-logo-orb" aria-hidden="true">
        <img src="/assets/images/brand/skama-logo-on-light.png" alt="" />
      </div>

      <article className="sk-auth-panel sk-auth-panel--brand sk-auth-panel--register sk-auth-panel--animated">
        <div className="sk-auth-panel__header">
          <p className="sk-kicker">Registro privado</p>
          <h1 className="sk-auth-panel__scan-title">
            <span>Crear cuenta SKAMA.</span>
          </h1>
          <p>Datos básicos para crear tu perfil privado.</p>
        </div>

        <form className="sk-auth-form" onSubmit={handleSubmit}>
          <div className="sk-auth-form-grid">
            <label className="sk-field" htmlFor="register-first-name">
              <span className="sk-field__label">Nombre</span>
              <input
                className="sk-input"
                id="register-first-name"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </label>

            <label className="sk-field" htmlFor="register-last-name">
              <span className="sk-field__label">Apellidos</span>
              <input
                className="sk-input"
                id="register-last-name"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </label>

            <label className="sk-field" htmlFor="register-email">
              <span className="sk-field__label">Correo electrónico</span>
              <input
                className="sk-input"
                id="register-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="sk-field sk-auth-password-field" htmlFor="register-password">
              <span className="sk-field__label">Contraseña</span>
              <span className="sk-auth-password-field__control">
                <input
                  className="sk-input"
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  className="sk-icon-button sk-icon-button--sm"
                  type="button"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon fontSize="small" />
                  ) : (
                    <VisibilityOutlinedIcon fontSize="small" />
                  )}
                </button>
              </span>
            </label>

            <label className="sk-field sk-auth-password-field" htmlFor="register-confirm-password">
              <span className="sk-field__label">Confirmar contraseña</span>
              <span className="sk-auth-password-field__control">
                <input
                  className="sk-input"
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
                <button
                  className="sk-icon-button sk-icon-button--sm"
                  type="button"
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  {showConfirmPassword ? (
                    <VisibilityOffOutlinedIcon fontSize="small" />
                  ) : (
                    <VisibilityOutlinedIcon fontSize="small" />
                  )}
                </button>
              </span>
            </label>
          </div>

          {formError && <p className="sk-validation">{formError}</p>}

          <button className="sk-button sk-button--primary sk-button--lg" type="submit" disabled={isLoading}>
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
          <RouterLink className="sk-button sk-button--secondary sk-button--lg" to={ROUTES.login}>
            Volver a iniciar sesión
          </RouterLink>
        </form>
      </article>
    </section>
  );
}
