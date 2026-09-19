import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/common/Spinner';
import './auth.css';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);

  function validate() {
    const errors = {};

    if (!name.trim()) errors.name = 'Name is required.';
    if (!email.trim()) errors.email = 'Email is required.';
    if (!password) errors.password = 'Password is required.';
    if (password && !passwordConfirmation) {
      errors.password_confirmation = 'Please confirm your password.';
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

    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);

    try {
      await register(name, email, password, passwordConfirmation);
      showToast('Account created. Welcome!', 'success');
      navigate('/');
    } catch (err) {
      if (err.response?.status === 422) {
        const backendErrors = err.response.data.errors || {};
        setFieldErrors(
          Object.fromEntries(Object.entries(backendErrors).map(([field, msgs]) => [field, msgs[0]]))
        );
      } else {
        showToast(err.response?.data?.message || 'Registration failed.', 'error');
      }
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__heading">Create an account</h1>
        <p className="auth-card__subheading">Sign up to start ordering</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="register-name">
              Name
            </label>
            <input
              id="register-name"
              className={`auth-field__input ${fieldErrors.name ? 'auth-field__input--invalid' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {fieldErrors.name && <p className="auth-field__error">{fieldErrors.name}</p>}
          </div>

          <div className="auth-field">
            <label className="auth-field__label" htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              className={`auth-field__input ${fieldErrors.email ? 'auth-field__input--invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && <p className="auth-field__error">{fieldErrors.email}</p>}
          </div>

          <div className="auth-field">
            <label className="auth-field__label" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              className={`auth-field__input ${fieldErrors.password ? 'auth-field__input--invalid' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && <p className="auth-field__error">{fieldErrors.password}</p>}
          </div>

          <div className="auth-field">
            <label className="auth-field__label" htmlFor="register-password-confirmation">
              Confirm Password
            </label>
            <input
              id="register-password-confirmation"
              type="password"
              className={`auth-field__input ${
                fieldErrors.password_confirmation ? 'auth-field__input--invalid' : ''
              }`}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            {fieldErrors.password_confirmation && (
              <p className="auth-field__error">{fieldErrors.password_confirmation}</p>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting && <Spinner size="sm" />}
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
