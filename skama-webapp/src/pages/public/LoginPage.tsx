import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.home;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    try {
      await login({ email, password });
      toast.success('Signed in successfully.');
      navigate(from, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed.';
      setFormError(message);
      toast.error(message);
    }
  }

  return (
    <section className="sk-auth-shell" aria-labelledby="login-title">
      <div className="sk-auth-intro">
        <p className="sk-kicker">Private access</p>
        <h1 id="login-title">Welcome back to the SKAMA experience.</h1>
        <p className="sk-lede">
          Sign in to access favorites, orders, and exclusive limited edition pieces.
        </p>
        <RouterLink className="sk-button sk-button--secondary sk-button--lg" to={ROUTES.home}>
          Back to home
        </RouterLink>
      </div>

      <article className="sk-auth-panel">
        <div>
          <p className="sk-kicker">SKAMA account</p>
          <h1>Sign in</h1>
        </div>
        <form className="sk-auth-form" onSubmit={handleSubmit}>
          <label className="sk-field" htmlFor="login-email">
            <span className="sk-field__label">Email address</span>
            <input
              className="sk-input"
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="sk-field" htmlFor="login-password">
            <span className="sk-field__label">Password</span>
            <input
              className="sk-input"
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <div className="sk-inline-row">
            <label className="sk-choice" htmlFor="login-remember">
              <input id="login-remember" type="checkbox" />
              <span className="sk-choice__control" aria-hidden="true" />
              <span className="sk-choice__label">Remember me</span>
            </label>
            <RouterLink className="sk-link" to={ROUTES.forgotPassword}>
              Forgot password
            </RouterLink>
          </div>
          {formError && <p className="sk-validation">{formError}</p>}
          <button className="sk-button sk-button--primary sk-button--lg" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
          <RouterLink className="sk-button sk-button--secondary sk-button--lg" to={ROUTES.register}>
            Create account
          </RouterLink>
        </form>
      </article>
    </section>
  );
}
