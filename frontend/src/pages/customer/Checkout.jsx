import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/orders';
import CartItemRow from '../../components/cart/CartItemRow';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [problemProduct, setProblemProduct] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [placing, setPlacing] = useState(false);

  function extractProblemProductId(message) {
    const match = message?.match(/Product\s+"(\d+)"/);
    return match ? Number(match[1]) : null;
  }

  async function handlePlaceOrder() {
    setError(null);
    setProblemProduct(null);
    setPlacing(true);

    try {
      const payload = items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const response = await createOrder(payload);
      const order = response.data.data;

      clearCart();
      setConfirmation(order);
    } catch (err) {
      const message = err.response?.data?.message || 'Could not place order. Please try again.';
      setError(message);

      const productId = extractProblemProductId(message);

      if (productId) {
        const item = items.find((i) => i.product_id === productId);
        setProblemProduct(item || null);
      }
    } finally {
      setPlacing(false);
    }
  }

  if (confirmation) {
    return (
      <div className="checkout-page">
        <h1>Order Placed!</h1>
        <div className="checkout-confirmation">
          <p>Order #{confirmation.id} confirmed.</p>
          <p>Total: ${Number(confirmation.total_price).toFixed(2)}</p>
        </div>
        <button onClick={() => navigate('/orders')}>View my orders</button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {items.map((item) => (
        <CartItemRow key={item.product_id} item={item} readOnly />
      ))}

      <p className="cart-summary__total" style={{ textAlign: 'right' }}>
        Total: <strong>${total.toFixed(2)}</strong>
      </p>

      {error && (
        <div className="checkout-error">
          <p>{error}</p>
          {problemProduct && (
            <p>
              The problem item appears to be <strong>{problemProduct.name}</strong>. Remove it
              from your cart and try again.
            </p>
          )}
        </div>
      )}

      <button className="btn btn--primary" onClick={handlePlaceOrder} disabled={placing}>
        {placing ? 'Placing order...' : 'Place Order'}
      </button>
    </div>
  );
}
