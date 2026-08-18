import { useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ROUTES } from '../../routes/routePaths';
import { authService } from '../../services';
import { getApiErrorMessage } from '../../utils';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setResetToken(null);

    try {
      const { data } = await authService.forgotPassword({ email });
      setMessage(data.message);
      setResetToken(data.resetToken ?? null);
      toast.success(data.message);
    } catch (error) {
      const fallback = 'No se pudo enviar la solicitud de recuperación.';
      const errorMessage = getApiErrorMessage(error, fallback);
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="sk-auth-shell" aria-labelledby="forgot-title">
      <div className="sk-auth-intro">
        <p className="sk-kicker">Recuperación</p>
        <h1 id="forgot-title">Restablece tu acceso privado.</h1>
        <p className="sk-lede">
          Ingresa el correo asociado con tu cuenta. Te enviaremos un enlace para definir una nueva contraseña.
        </p>
      </div>
      <article className="sk-auth-panel">
        <div>
          <p className="sk-kicker">Cuenta SKAMA</p>
          <h1>Olvidé mi contraseña</h1>
        </div>
        <form className="sk-auth-form" onSubmit={handleSubmit}>
          <label className="sk-field" htmlFor="forgot-email">
            <span className="sk-field__label">Correo electrónico</span>
            <input
              className="sk-input"
              id="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          {message && <p className="sk-validation">{message}</p>}
          {resetToken && (
            <p className="sk-validation">
              En desarrollo el correo no se envió.{' '}
              <RouterLink className="sk-link" to={`${ROUTES.resetPassword}?token=${encodeURIComponent(resetToken)}`}>
                Continuar con el restablecimiento
              </RouterLink>
            </p>
          )}
          <button className="sk-button sk-button--primary sk-button--lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
          </button>
          <RouterLink className="sk-button sk-button--secondary sk-button--lg" to={ROUTES.login}>
            Volver a iniciar sesión
          </RouterLink>
        </form>
      </article>
    </section>
  );
}
