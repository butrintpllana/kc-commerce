import { Fragment, useEffect, useRef, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../../api/orders';
import StatusBadge from '../../components/order/StatusBadge';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/common/Spinner';
import PageLoader from '../../components/common/PageLoader';
import './manage-orders.css';

const STATUSES = ['pending', 'processing', 'completed', 'cancelled'];

function ChevronIcon({ expanded }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`admin-order-chevron ${expanded ? 'is-expanded' : ''}`}
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

export default function ManageOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const updateInFlight = useRef(null);

  function load() {
    setLoading(true);
    const params = statusFilter ? { status: statusFilter } : {};

    return fetchOrders(params)
      .then((response) => setOrders(response.data.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [statusFilter]);

  function toggle(orderId) {
    setExpandedId((current) => (current === orderId ? null : orderId));
  }

  async function handleStatusChange(order, newStatus) {
    if (updateInFlight.current) return;
    updateInFlight.current = order.id;
    setUpdatingId(order.id);

    try {
      const response = await updateOrderStatus(order.id, newStatus);
      const updated = response.data.data;

      setOrders((current) =>
        current.map((o) => (o.id === order.id ? { ...o, status: updated.status } : o))
      );
      showToast(`Order #${order.id} status updated to "${newStatus}".`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || `Could not update order #${order.id}.`, 'error');
    } finally {
      updateInFlight.current = null;
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <h1>Orders</h1>
      </div>

      <div className="order-filter">
        <button
          className={`order-filter__tab ${!statusFilter ? 'is-active' : ''}`}
          onClick={() => setStatusFilter(null)}
        >
          All
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            className={`order-filter__tab ${statusFilter === status ? 'is-active' : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status[0].toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader label="Loading orders..." />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th className="is-numeric">Items</th>
                <th className="is-numeric">Total</th>
                <th style={{ width: 160 }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr className="admin-empty-row">
                  <td colSpan={7}>No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  const expanded = expandedId === order.id;

                  return (
                    <Fragment key={order.id}>
                      <tr className="admin-orders-row" onClick={() => toggle(order.id)}>
                        <td>
                          <ChevronIcon expanded={expanded} /> #{order.id}
                        </td>
                        <td>
                          {order.customer_name}
                          <br />
                          <small>{order.customer_email}</small>
                        </td>
                        <td>{new Date(order.created_at).toLocaleString()}</td>
                        <td>
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="is-numeric">{itemCount}</td>
                        <td className="is-numeric">${Number(order.total_price).toFixed(2)}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <select
                            className="status-select"
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order, e.target.value)}
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          {updatingId === order.id && (
                            <Spinner size="sm" className="status-select__spinner" />
                          )}
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="admin-order-items">
                          <td colSpan={7}>
                            {order.items.map((item) => (
                              <div className="admin-order-item-row" key={item.id}>
                                <span>{item.product_name}</span>
                                <span>Qty: {item.quantity}</span>
                                <span>${Number(item.unit_price).toFixed(2)} ea</span>
                                <span>${Number(item.subtotal).toFixed(2)}</span>
                              </div>
                            ))}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
