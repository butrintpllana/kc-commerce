import { Fragment, useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../../api/orders';
import StatusBadge from '../../components/order/StatusBadge';
import './manage-orders.css';

const STATUSES = ['pending', 'processing', 'completed', 'cancelled'];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

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
    setToast(null);
    setUpdatingId(order.id);

    try {
      const response = await updateOrderStatus(order.id, newStatus);
      const updated = response.data.data;

      setOrders((current) =>
        current.map((o) => (o.id === order.id ? { ...o, status: updated.status } : o))
      );
      setToast({ type: 'success', message: `Order #${order.id} status updated to "${newStatus}".` });
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || `Could not update order #${order.id}.`,
      });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h1>Orders</h1>

      {toast && <div className={`toast toast--${toast.type}`}>{toast.message}</div>}

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
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Items</th>
              <th>Total</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <Fragment key={order.id}>
                  <tr
                    className="admin-orders-row"
                    onClick={() => toggle(order.id)}
                  >
                    <td>#{order.id}</td>
                    <td>
                      {order.customer_name}
                      <br />
                      <small>{order.customer_email}</small>
                    </td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </td>
                    <td>${Number(order.total_price).toFixed(2)}</td>
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
                    </td>
                  </tr>
                  {expandedId === order.id && (
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
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
