import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ROUTES } from '../../routes/routePaths';
import { authService } from '../../services';
import { getApiErrorMessage } from '../../utils';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword({ token, newPassword, confirmPassword });
      toast.success('Password actualizada.');
      navigate(ROUTES.login);
    } catch (error) {
      const message = getApiErrorMessage(error, 'The password could not be reset.');
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="sk-auth-shell" aria-labelledby="reset-title">
      <div className="sk-auth-intro">
        <p className="sk-kicker">New access</p>
        <h1 id="reset-title">Set a new password.</h1>
        <p className="sk-lede">
          Use the token sent by the system to complete the reset.
        </p>
      </div>
      <article className="sk-auth-panel">
        <div>
          <p className="sk-kicker">SKAMA account</p>
          <h1>Reset password</h1>
        </div>
        <form className="sk-auth-form" onSubmit={handleSubmit}>
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
          <label className="sk-field" htmlFor="reset-password">
            <span className="sk-field__label">New password</span>
            <input
              className="sk-input"
              id="reset-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </label>
          <label className="sk-field" htmlFor="reset-confirm-password">
            <span className="sk-field__label">Confirm password</span>
            <input
              className="sk-input"
              id="reset-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
          {formError && <p className="sk-validation">{formError}</p>}
          <button className="sk-button sk-button--primary sk-button--lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save password'}
          </button>
          <RouterLink className="sk-button sk-button--secondary sk-button--lg" to={ROUTES.login}>
            Back to sign in
          </RouterLink>
        </form>
      </article>
    </section>
  );
}
