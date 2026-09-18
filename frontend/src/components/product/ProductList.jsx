import ProductCard from './ProductCard';
import './product.css';

export default function ProductList({ products }) {
  if (products.length === 0) {
    return <p className="empty-state">No products found in this category.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
