import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>{' | '}
      <Link to="/cart">Cart</Link>{' | '}
      {user ? (
        <>
          <Link to="/orders">Orders</Link>{' | '}
          {isAdmin && (
            <>
              <Link to="/admin">Admin</Link>{' | '}
            </>
          )}
          <span>{user.name} ({user.role})</span>{' '}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>{' | '}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
