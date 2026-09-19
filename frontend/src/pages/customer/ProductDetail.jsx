import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct } from '../../api/products';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import PageLoader from '../../components/common/PageLoader';
import './product-detail.css';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#e5e4e7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#8a8894" font-family="sans-serif" font-size="18">No Image</text></svg>'
  );

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setQuantity(1);

    fetchProduct(id)
      .then((response) => setProduct(response.data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    addItem(product, quantity);
    showToast(`${quantity} × ${product.name} added to cart.`, 'success');
  }

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => q + 1);
  }

  if (loading) {
    return <PageLoader label="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <p>Product not found.</p>
        <Link to="/">Back to menu</Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail__image-wrap">
        <img
          src={product.image_url || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="product-detail__image"
        />
      </div>
      <div className="product-detail__info">
        {product.category?.name && <span className="badge">{product.category.name}</span>}
        <h1 className="product-detail__name">{product.name}</h1>
        <p className="product-detail__price">${Number(product.price).toFixed(2)}</p>
        <p className="product-detail__description">{product.description}</p>

        <div className="product-detail__quantity">
          <span className="product-detail__quantity-label">Quantity</span>
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
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
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
        </div>

        <button className="btn btn--primary product-detail__add" onClick={handleAddToCart}>
          Add to Cart — ${(Number(product.price) * quantity).toFixed(2)}
        </button>
      </div>
    </div>
  );
}
