import './status-badge.css';

export default function StatusBadge({ status }) {
  return <span className={`order-status-badge order-status-badge--${status}`}>{status}</span>;
}
