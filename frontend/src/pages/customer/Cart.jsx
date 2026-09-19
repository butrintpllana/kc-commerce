import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItemRow from '../../components/cart/CartItemRow';
import CartSummary from '../../components/cart/CartSummary';

function EmptyCartIcon() {
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
        d="M3 3h2l.4 2M7 13h10l3.6-8H5.4M7 13L5.4 5M7 13l-2.29 2.29A1 1 0 0 0 5.42 17H17M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
    </svg>
  );
}

export default function Cart() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <div className="empty-state">
          <EmptyCartIcon />
          <p className="empty-state__title">Your cart is empty</p>
          <p className="empty-state__message">Looks like you haven't added anything yet.</p>
          <Link to="/" className="btn btn--primary">
            Browse the menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <CartItemRow key={item.product_id} item={item} />
          ))}
        </div>
        <CartSummary />
      </div>
    </div>
  );
}
