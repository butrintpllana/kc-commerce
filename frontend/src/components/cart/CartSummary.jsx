import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './cart.css';

export default function CartSummary({ checkoutTo = '/checkout' }) {
  const { total, itemCount } = useCart();

  return (
    <div className="cart-summary">
      <p className="cart-summary__total">
        Total ({itemCount} {itemCount === 1 ? 'item' : 'items'}): <strong>${total.toFixed(2)}</strong>
      </p>
      {itemCount > 0 && (
        <Link to={checkoutTo} className="btn btn--primary cart-summary__checkout">
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}
