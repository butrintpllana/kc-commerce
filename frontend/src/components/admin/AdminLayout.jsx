import { NavLink, Outlet } from 'react-router-dom';
import { CategoriesIcon, OrdersIcon, ProductsIcon } from './icons';
import './admin.css';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="admin-sidebar__heading">Admin Panel</div>
        <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'is-active' : '')}>
          <ProductsIcon />
          <span>Products</span>
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) => (isActive ? 'is-active' : '')}
        >
          <CategoriesIcon />
          <span>Categories</span>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'is-active' : '')}>
          <OrdersIcon />
          <span>Orders</span>
        </NavLink>
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
