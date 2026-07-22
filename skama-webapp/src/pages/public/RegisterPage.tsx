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
      const message = 'Las contrasenas no coinciden.';
      setFormError(message);
      toast.error(message);
      return;
    }

    try {
      await register({ email, password, confirmPassword });
      toast.success('Cuenta creada. Ya puedes iniciar sesion.');
      navigate(ROUTES.login);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo completar el registro.';
      setFormError(message);
      toast.error(message);
    }
  }

  return (
    <section className="sk-auth-shell" aria-labelledby="register-title">
      <div className="sk-auth-intro">
        <p className="sk-kicker">Cuenta privada</p>
        <h1 id="register-title">Crea tu acceso a SKAMA Jewelry.</h1>
        <p className="sk-lede">
          Registra una cuenta para sincronizar favoritos, consultar pedidos y gestionar piezas
          exclusivas con informacion de cliente.
        </p>
        <RouterLink className="sk-button sk-button--secondary sk-button--lg" to={ROUTES.catalog}>
          Explorar colecciones
        </RouterLink>
      </div>

      <article className="sk-auth-panel">
        <div>
          <p className="sk-kicker">Nuevo cliente</p>
          <h1>Crear cuenta</h1>
        </div>
        <form className="sk-auth-form" onSubmit={handleSubmit}>
          <label className="sk-field" htmlFor="register-email">
            <span className="sk-field__label">Correo electronico</span>
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
            <span className="sk-field__label">Contrasena</span>
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
            <span className="sk-field__label">Confirmar contrasena</span>
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
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
          <RouterLink className="sk-button sk-button--secondary sk-button--lg" to={ROUTES.login}>
            Ya tengo cuenta
          </RouterLink>
        </form>
      </article>
    </section>
  );
}
