import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItemRow from '../../components/cart/CartItemRow';
import CartSummary from '../../components/cart/CartSummary';

export default function Cart() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Back to menu</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {items.map((item) => (
        <CartItemRow key={item.product_id} item={item} />
      ))}
      <CartSummary />
    </div>
  );
}
