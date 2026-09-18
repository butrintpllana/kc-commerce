import { useEffect, useState } from 'react';
import { fetchProducts } from '../../api/products';
import CategoryFilter from '../../components/product/CategoryFilter';
import ProductList from '../../components/product/ProductList';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const params = categoryId ? { category_id: categoryId } : {};

    fetchProducts(params)
      .then((response) => setProducts(response.data.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <div className="home-page">
      <h1>Menu</h1>
      <CategoryFilter selectedCategoryId={categoryId} onSelect={setCategoryId} />
      {loading ? <p>Loading...</p> : <ProductList products={products} />}
    </div>
  );
}
