import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import './cart.css';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="#e5e4e7"/></svg>'
  );

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6h14Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CartItemRow({ item, readOnly = false }) {
  const { updateQuantity, removeItem, addItem } = useCart();
  const { showToast } = useToast();

  const subtotal = Number(item.price) * item.quantity;

  function handleQuantityChange(event) {
    const quantity = Math.max(1, Number(event.target.value) || 1);
    updateQuantity(item.product_id, quantity);
  }

  function decrement() {
    updateQuantity(item.product_id, Math.max(1, item.quantity - 1));
  }

  function increment() {
    updateQuantity(item.product_id, item.quantity + 1);
  }

  function handleRemove() {
    const removedItem = { ...item };
    removeItem(item.product_id);

    showToast(`${removedItem.name} removed from cart.`, 'info', {
      action: {
        label: 'Undo',
        onClick: () => {
          addItem(
            { id: removedItem.product_id, name: removedItem.name, price: removedItem.price },
            removedItem.quantity
          );
        },
      },
    });
  }

  return (
    <div className="cart-item">
      <img src={item.image_url || PLACEHOLDER_IMAGE} alt={item.name} className="cart-item__image" />
      <div className="cart-item__info">
        <p className="cart-item__name">{item.name}</p>
        <p className="cart-item__price">${Number(item.price).toFixed(2)} each</p>
      </div>

      {readOnly ? (
        <span className="cart-item__quantity-static">Qty: {item.quantity}</span>
      ) : (
        <div className="quantity-stepper">
          <button
            type="button"
            className="quantity-stepper__btn"
            onClick={decrement}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="quantity-stepper__input"
            aria-label="Quantity"
          />
          <button
            type="button"
            className="quantity-stepper__btn"
            onClick={increment}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}

      <p className="cart-item__subtotal">${subtotal.toFixed(2)}</p>

      {!readOnly && (
        <button className="cart-item__remove" onClick={handleRemove} aria-label="Remove item">
          <TrashIcon />
        </button>
      )}
    </div>
  );
}
