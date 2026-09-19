import './spinner.css';

const SIZE_CLASSES = {
  sm: 'spinner--sm',
  lg: 'spinner--lg',
};

export default function Spinner({ size = 'sm', className = '', label = 'Loading' }) {
  return (
    <span
      className={`spinner ${SIZE_CLASSES[size] || SIZE_CLASSES.sm} ${className}`}
      role="status"
      aria-label={label}
    />
  );
}
