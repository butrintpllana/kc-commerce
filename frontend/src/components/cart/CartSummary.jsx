import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './cart.css';

export default function CartSummary({ checkoutTo = '/checkout' }) {
  const { total, itemCount } = useCart();

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__heading">Order Summary</h2>

      <div className="cart-summary__row">
        <span>
          Items ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="cart-summary__row cart-summary__row--total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {itemCount > 0 && (
        <Link to={checkoutTo} className="btn btn--primary cart-summary__checkout">
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}
