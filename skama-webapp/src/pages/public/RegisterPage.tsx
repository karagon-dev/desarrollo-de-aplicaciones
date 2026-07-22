import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks';
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
      const message = 'Passwords do not match.';
      setFormError(message);
      toast.error(message);
      return;
    }

    try {
      await register({ email, password, confirmPassword });
      toast.success('Account created. You can now sign in.');
      navigate(ROUTES.login);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration could not be completed.';
      setFormError(message);
      toast.error(message);
    }
  }

  return (
    <section className="sk-auth-shell" aria-labelledby="register-title">
      <div className="sk-auth-intro">
        <p className="sk-kicker">Private account</p>
        <h1 id="register-title">Create your SKAMA Jewelry access.</h1>
        <p className="sk-lede">
          Create an account to sync favorites, review orders, and manage pieces
          exclusivas con informacion de cliente.
        </p>
        <RouterLink className="sk-button sk-button--secondary sk-button--lg" to={ROUTES.catalog}>
          Explore collections
        </RouterLink>
      </div>

      <article className="sk-auth-panel">
        <div>
          <p className="sk-kicker">New customer</p>
          <h1>Create account</h1>
        </div>
        <form className="sk-auth-form" onSubmit={handleSubmit}>
          <label className="sk-field" htmlFor="register-email">
            <span className="sk-field__label">Email address</span>
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
          <label className="sk-field" htmlFor="register-password">
            <span className="sk-field__label">Password</span>
            <input
              className="sk-input"
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label className="sk-field" htmlFor="register-confirm-password">
            <span className="sk-field__label">Confirm password</span>
            <input
              className="sk-input"
              id="register-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
          {formError && <p className="sk-validation">{formError}</p>}
          <button className="sk-button sk-button--primary sk-button--lg" type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <RouterLink className="sk-button sk-button--secondary sk-button--lg" to={ROUTES.login}>
            I already have an account
          </RouterLink>
        </form>
      </article>
    </section>
  );
}
