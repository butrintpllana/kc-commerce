import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/common/Spinner';
import './auth.css';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);

  function validate() {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // Guard with a ref (not just state) so two submits dispatched in the same
    // tick — e.g. a fast double-click — can't both slip past before React re-renders.
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);

    try {
      await login(email, password);
      showToast('Logged in successfully.', 'success');
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed.', 'error');
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__heading">Welcome back</h1>
        <p className="auth-card__subheading">Log in to your account</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className={`auth-field__input ${fieldErrors.email ? 'auth-field__input--invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && <p className="auth-field__error">{fieldErrors.email}</p>}
          </div>

          <div className="auth-field">
            <label className="auth-field__label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className={`auth-field__input ${fieldErrors.password ? 'auth-field__input--invalid' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && <p className="auth-field__error">{fieldErrors.password}</p>}
          </div>

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting && <Spinner size="sm" />}
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
