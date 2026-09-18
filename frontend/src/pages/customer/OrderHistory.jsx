import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../api/orders';
import StatusBadge from '../../components/order/StatusBadge';
import './order-history.css';

function OrderCard({ order, expanded, onToggle }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const datePlaced = new Date(order.created_at).toLocaleString();

  return (
    <div className="order-card">
      <div className="order-card__header" onClick={onToggle}>
        <span className="order-card__id">Order #{order.id}</span>
        <span className="order-card__date">{datePlaced}</span>
        <StatusBadge status={order.status} />
        <span className="order-card__count">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
        <span className="order-card__total">${Number(order.total_price).toFixed(2)}</span>
      </div>

      {expanded && (
        <div className="order-card__items">
          {order.items.map((item) => (
            <div className="order-card__item-row" key={item.id}>
              <span className="order-card__item-name">{item.product_name}</span>
              <span className="order-card__item-qty">Qty: {item.quantity}</span>
              <span className="order-card__item-unit">${Number(item.unit_price).toFixed(2)} ea</span>
              <span className="order-card__item-subtotal">${Number(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchOrders()
      .then((response) => setOrders(response.data.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  function toggle(orderId) {
    setExpandedId((current) => (current === orderId ? null : orderId));
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="order-history">
        <h1>My Orders</h1>
        <p>You haven't placed any orders yet.</p>
        <Link to="/">Browse the menu</Link>
      </div>
    );
  }

  return (
    <div className="order-history">
      <h1>My Orders</h1>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          expanded={expandedId === order.id}
          onToggle={() => toggle(order.id)}
        />
      ))}
    </div>
  );
}
