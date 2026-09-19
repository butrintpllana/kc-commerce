import { useEffect } from 'react';
import './slide-over.css';

export default function SlideOver({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <div className={`slide-over ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="slide-over__backdrop" onClick={onClose} />
      <div className="slide-over__panel" role="dialog" aria-modal="true" aria-label={title}>
        <div className="slide-over__header">
          <h2 className="slide-over__title">{title}</h2>
          <button className="slide-over__close" onClick={onClose} aria-label="Close panel">
            ×
          </button>
        </div>
        <div className="slide-over__body">{children}</div>
      </div>
    </div>
  );
}
