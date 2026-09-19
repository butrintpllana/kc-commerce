import ProductCard from './ProductCard';
import './product.css';

function EmptyIcon() {
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

export default function ProductList({ products }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <EmptyIcon />
        <p className="empty-state__title">No products found</p>
        <p className="empty-state__message">
          There's nothing in this category right now. Try a different filter.
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
