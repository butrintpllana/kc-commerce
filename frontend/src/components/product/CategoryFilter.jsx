import { useEffect, useState } from 'react';
import { fetchCategories } from '../../api/categories';
import './product.css';

export default function CategoryFilter({ selectedCategoryId, onSelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then((response) => setCategories(response.data.data))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="category-filter">
      <button
        className={`category-filter__tab ${!selectedCategoryId ? 'is-active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-filter__tab ${
            selectedCategoryId === category.id ? 'is-active' : ''
          }`}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
