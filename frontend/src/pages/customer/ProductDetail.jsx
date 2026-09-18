import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct } from '../../api/products';
import { useCart } from '../../context/CartContext';
import './product-detail.css';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#e5e4e7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#8a8894" font-family="sans-serif" font-size="18">No Image</text></svg>'
  );

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setAdded(false);

    fetchProduct(id)
      .then((response) => setProduct(response.data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    addItem(product, quantity);
    setAdded(true);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return (
      <div>
        <p>Product not found.</p>
        <Link to="/">Back to menu</Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <img
        src={product.image_url || PLACEHOLDER_IMAGE}
        alt={product.name}
        className="product-detail__image"
      />
      <div className="product-detail__info">
        {product.category?.name && <span className="badge">{product.category.name}</span>}
        <h1>{product.name}</h1>
        <p className="product-detail__price">${Number(product.price).toFixed(2)}</p>
        <p className="product-detail__description">{product.description}</p>

        <div className="product-detail__quantity">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          />
        </div>

        <button className="btn btn--primary" onClick={handleAddToCart}>
          Add to Cart
        </button>
        {added && <p className="product-detail__added">Added to cart!</p>}
      </div>
    </div>
  );
}
