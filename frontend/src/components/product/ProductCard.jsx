import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import './product.css';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225"><rect width="100%" height="100%" fill="#e5e4e7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#8a8894" font-family="sans-serif" font-size="16">No Image</text></svg>'
  );

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [justAdded, setJustAdded] = useState(false);

  function handleAddToCart(event) {
    event.preventDefault();
    addItem(product, 1);
    showToast(`${product.name} added to cart.`, 'success');

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__link">
        <div className="product-card__image-wrap">
          <img
            src={product.image_url || PLACEHOLDER_IMAGE}
            alt={product.name}
            className="product-card__image"
          />
        </div>
        <div className="product-card__body">
          {product.category?.name && (
            <span className="badge">{product.category.name}</span>
          )}
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__price">${Number(product.price).toFixed(2)}</p>
        </div>
      </Link>
      <div className="product-card__footer">
        <button
          className={`btn btn--primary ${justAdded ? 'is-added' : ''}`}
          onClick={handleAddToCart}
        >
          {justAdded ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
