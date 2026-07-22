import { useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ROUTES } from '../../routes/routePaths';
import { authService } from '../../services';
import { getApiErrorMessage } from '../../utils';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const { data } = await authService.forgotPassword({ email });
      setMessage(data.message);
      toast.success(data.message);
    } catch (error) {
      const fallback = 'The recovery request could not be submitted.';
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
        <p className="sk-kicker">Recovery</p>
        <h1 id="forgot-title">Reset your private access.</h1>
        <p className="sk-lede">
          Enter the email associated with your account to start recovery.
        </p>
      </div>
      <article className="sk-auth-panel">
        <div>
          <p className="sk-kicker">SKAMA account</p>
          <h1>Forgot password</h1>
        </div>
        <form className="sk-auth-form" onSubmit={handleSubmit}>
          <label className="sk-field" htmlFor="forgot-email">
            <span className="sk-field__label">Email address</span>
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
          <button className="sk-button sk-button--primary sk-button--lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send request'}
          </button>
          <RouterLink className="sk-button sk-button--secondary sk-button--lg" to={ROUTES.login}>
            Back to sign in
          </RouterLink>
        </form>
      </article>
    </section>
  );
}
