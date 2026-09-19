import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../context/CartContext';
import './navbar.css';

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function closeMenus() {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }

  async function handleLogout() {
    closeMenus();
    await logout();
    navigate('/');
  }

  const initial = user?.name?.trim()?.[0]?.toUpperCase() || '?';

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={closeMenus}>
          KC<span>Commerce</span>
        </Link>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <HamburgerIcon />
        </button>

        <nav className={`navbar__links ${menuOpen ? 'is-open' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
            onClick={closeMenus}
          >
            Home
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
            onClick={closeMenus}
          >
            Cart
            {itemCount > 0 && <span className="navbar__cart-badge">{itemCount}</span>}
          </NavLink>

          {user && (
            <NavLink
              to="/orders"
              className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
              onClick={closeMenus}
            >
              My Orders
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
              onClick={closeMenus}
            >
              Admin
            </NavLink>
          )}

          {user ? (
            <div className="navbar__user" ref={userMenuRef}>
              <button
                className="navbar__user-trigger"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-expanded={userMenuOpen}
              >
                <span className="navbar__user-avatar">{initial}</span>
                <span className="navbar__user-name">{user.name}</span>
              </button>

              {(userMenuOpen || menuOpen) && (
                <div className="navbar__user-menu">
                  <div className="navbar__user-menu-header">{user.email}</div>
                  <button className="navbar__user-menu-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-links">
              <Link to="/login" className="navbar__link" onClick={closeMenus}>
                Login
              </Link>
              <Link to="/register" className="navbar__link navbar__link--primary" onClick={closeMenus}>
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
