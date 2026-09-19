import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { createOrder } from '../../api/orders';
import CartItemRow from '../../components/cart/CartItemRow';
import Spinner from '../../components/common/Spinner';

function CheckmarkIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [problemProductId, setProblemProductId] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [placing, setPlacing] = useState(false);
  const inFlight = useRef(false);

  function extractProblemProductId(message) {
    const match = message?.match(/Product\s+"(\d+)"/);
    return match ? Number(match[1]) : null;
  }

  async function handlePlaceOrder() {
    if (inFlight.current) return;
    inFlight.current = true;

    setProblemProductId(null);
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
      showToast(`Order #${order.id} placed successfully.`, 'success');
    } catch (err) {
      const message = err.response?.data?.message || 'Could not place order. Please try again.';
      showToast(message, 'error');
      setProblemProductId(extractProblemProductId(message));
    } finally {
      inFlight.current = false;
      setPlacing(false);
    }
  }

  if (confirmation) {
    return (
      <div className="checkout-page">
        <div className="checkout-confirmation">
          <div className="checkout-confirmation__icon">
            <CheckmarkIcon />
          </div>
          <h1>Order Placed!</h1>
          <p className="checkout-confirmation__order-id">Order #{confirmation.id}</p>
          <p className="checkout-confirmation__total">
            ${Number(confirmation.total_price).toFixed(2)}
          </p>
          <button className="btn btn--primary" onClick={() => navigate('/orders')}>
            View my orders
          </button>
        </div>
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

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.product_id}>
              <CartItemRow item={item} readOnly />
              {problemProductId === item.product_id && (
                <p className="checkout-error">
                  This item is no longer available. Remove it from your cart and try again.
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="cart-summary__heading">Order Summary</h2>
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            className="btn btn--primary cart-summary__checkout"
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing && <Spinner size="sm" />}
            {placing ? 'Placing order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
