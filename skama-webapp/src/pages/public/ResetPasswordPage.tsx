import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ROUTES } from '../../routes/routePaths';
import { authService } from '../../services';
import { getApiErrorMessage } from '../../utils';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromLink = searchParams.get('token') ?? '';
  const [token, setToken] = useState(tokenFromLink);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTokenFromLink = tokenFromLink.length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (newPassword !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword({ token, newPassword, confirmPassword });
      toast.success('Contraseña actualizada.');
      navigate(ROUTES.login);
    } catch (error) {
      const message = getApiErrorMessage(error, 'No se pudo restablecer la contraseña.');
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="sk-auth-shell" aria-labelledby="reset-title">
      <div className="sk-auth-intro">
        <p className="sk-kicker">Nuevo acceso</p>
        <h1 id="reset-title">Define una nueva contraseña.</h1>
        <p className="sk-lede">
          {hasTokenFromLink
            ? 'Usa el enlace que enviamos a tu correo para completar el restablecimiento.'
            : 'Ingresa el token recibido por correo para completar el restablecimiento.'}
        </p>
      </div>
      <article className="sk-auth-panel">
        <div>
          <p className="sk-kicker">Cuenta SKAMA</p>
          <h1>Restablecer contraseña</h1>
        </div>
        <form className="sk-auth-form" onSubmit={handleSubmit}>
          {!hasTokenFromLink && (
            <label className="sk-field" htmlFor="reset-token">
              <span className="sk-field__label">Token</span>
              <input
                className="sk-input"
                id="reset-token"
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                required
              />
            </label>
          )}
          <label className="sk-field" htmlFor="reset-password">
            <span className="sk-field__label">Nueva contraseña</span>
            <input
              className="sk-input"
              id="reset-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </label>
          <label className="sk-field" htmlFor="reset-confirm-password">
            <span className="sk-field__label">Confirmar contraseña</span>
            <input
              className="sk-input"
              id="reset-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
          {formError && <p className="sk-validation">{formError}</p>}
          <button className="sk-button sk-button--primary sk-button--lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar contraseña'}
          </button>
          <RouterLink className="sk-button sk-button--secondary sk-button--lg" to={ROUTES.login}>
            Volver a iniciar sesión
          </RouterLink>
        </form>
      </article>
    </section>
  );
}
