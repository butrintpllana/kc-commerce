import { NavLink, Outlet } from 'react-router-dom';
import './admin.css';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Products
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) => (isActive ? 'is-active' : '')}
        >
          Categories
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Orders
        </NavLink>
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
