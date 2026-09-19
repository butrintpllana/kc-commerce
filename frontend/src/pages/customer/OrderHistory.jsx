import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../api/orders';
import StatusBadge from '../../components/order/StatusBadge';
import PageLoader from '../../components/common/PageLoader';
import './order-history.css';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="100%" height="100%" fill="#e5e4e7"/></svg>'
  );

function ChevronIcon({ expanded }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={`order-card__chevron ${expanded ? 'is-expanded' : ''}`}
      aria-hidden="true"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmptyOrdersIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="empty-state__icon"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6M9 8h6M5 3h14a1 1 0 0 1 1 1v16l-4-2-3 2-3-2-3 2-3-2V4a1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}

function OrderCard({ order, expanded, onToggle }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const datePlaced = new Date(order.created_at).toLocaleString();

  return (
    <div className="order-card">
      <button className="order-card__header" onClick={onToggle} aria-expanded={expanded}>
        <span className="order-card__id">Order #{order.id}</span>
        <span className="order-card__date">{datePlaced}</span>
        <StatusBadge status={order.status} />
        <span className="order-card__count">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
        <span className="order-card__total">${Number(order.total_price).toFixed(2)}</span>
        <ChevronIcon expanded={expanded} />
      </button>

      <div className={`order-card__items-wrapper ${expanded ? 'is-expanded' : ''}`}>
        <div className="order-card__items-inner">
          <div className="order-card__items">
            {order.items.map((item) => (
              <div className="order-card__item-row" key={item.id}>
                <img
                  src={item.product_image_url || PLACEHOLDER_IMAGE}
                  alt={item.product_name}
                  className="order-card__item-image"
                />
                <span className="order-card__item-name">{item.product_name}</span>
                <span className="order-card__item-qty">Qty: {item.quantity}</span>
                <span className="order-card__item-unit">${Number(item.unit_price).toFixed(2)} ea</span>
                <span className="order-card__item-subtotal">${Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
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
    return <PageLoader label="Loading your orders..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="order-history">
        <h1>My Orders</h1>
        <div className="empty-state">
          <EmptyOrdersIcon />
          <p className="empty-state__title">No orders yet</p>
          <p className="empty-state__message">
            You haven't placed any orders yet. Once you do, they'll show up here.
          </p>
          <Link to="/" className="btn btn--primary">
            Browse the menu
          </Link>
        </div>
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
