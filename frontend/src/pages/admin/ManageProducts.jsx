import { useEffect, useState } from 'react';
import { fetchCategories } from '../../api/categories';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../../api/products';

const emptyForm = {
  category_id: '',
  name: '',
  description: '',
  price: '',
  image_url: '',
  is_active: true,
};

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function load() {
    setLoading(true);
    return Promise.all([fetchProducts(), fetchCategories()])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data.data);
        setCategories(categoriesRes.data.data);
      })
      .catch(() => {
        setProducts([]);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setShowForm(true);
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      category_id: product.category_id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      image_url: product.image_url || '',
      is_active: product.is_active,
    });
    setErrors({});
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});

    const payload = {
      ...form,
      category_id: Number(form.category_id),
      price: Number(form.price),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setToast({ type: 'success', message: 'Product updated.' });
      } else {
        await createProduct(payload);
        setToast({ type: 'success', message: 'Product created.' });
      }

      cancelForm();
      load();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setToast({ type: 'error', message: err.response?.data?.message || 'Something went wrong.' });
      }
    }
  }

  async function handleDelete(product) {
    setToast(null);

    try {
      const response = await deleteProduct(product.id);
      setToast({ type: 'success', message: response.data.message });
      load();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Could not delete this product.',
      });
    }
  }

  return (
    <div>
      <h1>Products</h1>

      {toast && <div className={`toast toast--${toast.type}`}>{toast.message}</div>}

      <div className="admin-toolbar">
        {!showForm && (
          <button className="btn btn--primary" onClick={startCreate}>
            Add Product
          </button>
        )}
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>

          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            {errors.name && <p className="field-error">{errors.name[0]}</p>}
          </label>

          <label>
            Category
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="field-error">{errors.category_id[0]}</p>}
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
            {errors.description && <p className="field-error">{errors.description[0]}</p>}
          </label>

          <label>
            Price
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            {errors.price && <p className="field-error">{errors.price[0]}</p>}
          </label>

          <label>
            Image URL
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
            />
            {errors.image_url && <p className="field-error">{errors.image_url[0]}</p>}
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              style={{ display: 'inline', width: 'auto', marginRight: '6px' }}
            />
            Active
          </label>

          <div className="admin-form__actions">
            <button type="submit" className="btn btn--primary">
              {editingId ? 'Save Changes' : 'Add Product'}
            </button>
            <button type="button" className="btn btn--secondary" onClick={cancelForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category?.name}</td>
                <td>${Number(product.price).toFixed(2)}</td>
                <td>
                  <span
                    className={`status-pill ${
                      product.is_active ? 'status-pill--active' : 'status-pill--inactive'
                    }`}
                  >
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn btn--secondary" onClick={() => startEdit(product)}>
                    Edit
                  </button>{' '}
                  <button className="btn btn--danger" onClick={() => handleDelete(product)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
