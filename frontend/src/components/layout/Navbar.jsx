import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav>
      <Link to="/">Home</Link>{' | '}
      <Link to="/cart">Cart ({itemCount})</Link>{' | '}
      {user ? (
        <>
          <Link to="/orders">My Orders</Link>{' | '}
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
