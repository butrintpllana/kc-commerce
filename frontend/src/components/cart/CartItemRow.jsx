import { useCart } from '../../context/CartContext';
import './cart.css';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="#e5e4e7"/></svg>'
  );

export default function CartItemRow({ item, readOnly = false }) {
  const { updateQuantity, removeItem } = useCart();

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
        <div className="cart-item__quantity">
          <button onClick={decrement} aria-label="Decrease quantity">-</button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
          />
          <button onClick={increment} aria-label="Increase quantity">+</button>
        </div>
      )}

      <p className="cart-item__subtotal">${subtotal.toFixed(2)}</p>

      {!readOnly && (
        <button className="cart-item__remove" onClick={() => removeItem(item.product_id)}>
          Remove
        </button>
      )}
    </div>
  );
}
