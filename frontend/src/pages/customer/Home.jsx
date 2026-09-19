import { useEffect, useRef, useState } from 'react';
import { fetchProducts } from '../../api/products';
import CategoryFilter from '../../components/product/CategoryFilter';
import ProductList from '../../components/product/ProductList';
import PageLoader from '../../components/common/PageLoader';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    setLoading(true);

    const params = categoryId ? { category_id: categoryId } : {};

    fetchProducts(params)
      .then((response) => setProducts(response.data.data))
      .catch(() => setProducts([]))
      .finally(() => {
        hasLoadedOnce.current = true;
        setLoading(false);
      });
  }, [categoryId]);

  return (
    <div className="home-page">
      <h1>Menu</h1>
      <CategoryFilter selectedCategoryId={categoryId} onSelect={setCategoryId} />

      {loading && !hasLoadedOnce.current ? (
        <PageLoader label="Loading menu..." />
      ) : (
        <div className={loading ? 'product-grid--loading' : ''}>
          <ProductList products={products} />
        </div>
      )}
    </div>
  );
}
