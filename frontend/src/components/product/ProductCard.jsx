import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './product.css';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="#e5e4e7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#8a8894" font-family="sans-serif" font-size="16">No Image</text></svg>'
  );

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  function handleAddToCart(event) {
    event.preventDefault();
    addItem(product, 1);
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__link">
        <img
          src={product.image_url || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="product-card__image"
        />
        <div className="product-card__body">
          {product.category?.name && (
            <span className="badge">{product.category.name}</span>
          )}
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__price">${Number(product.price).toFixed(2)}</p>
        </div>
      </Link>
      <button className="btn btn--primary" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}
