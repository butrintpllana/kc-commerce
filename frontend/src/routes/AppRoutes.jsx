import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminRoute, ProtectedRoute } from '../auth/ProtectedRoute';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/customer/Home';
import ProductDetail from '../pages/customer/ProductDetail';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import OrderHistory from '../pages/customer/OrderHistory';
import AdminLayout from '../components/admin/AdminLayout';
import ManageProducts from '../pages/admin/ManageProducts';
import ManageCategories from '../pages/admin/ManageCategories';
import ManageOrders from '../pages/admin/ManageOrders';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="orders" element={<ManageOrders />} />
        </Route>
      </Route>
    </Routes>
  );
}
