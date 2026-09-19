import { useEffect, useRef, useState } from 'react';
import { fetchCategories } from '../../api/categories';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../../api/products';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/common/Spinner';
import PageLoader from '../../components/common/PageLoader';
import SlideOver from '../../components/common/SlideOver';
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/admin/icons';
import '../../components/admin/admin-form.css';

const emptyForm = {
  category_id: '',
  name: '',
  description: '',
  price: '',
  image_url: '',
  is_active: true,
};

export default function ManageProducts() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [panelOpen, setPanelOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const submitInFlight = useRef(false);
  const deleteInFlight = useRef(null);

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
    setPanelOpen(true);
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
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitInFlight.current) return;
    submitInFlight.current = true;

    setErrors({});
    setSubmitting(true);

    const payload = {
      ...form,
      category_id: Number(form.category_id),
      price: Number(form.price),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        showToast('Product updated.', 'success');
      } else {
        await createProduct(payload);
        showToast('Product created.', 'success');
      }

      closePanel();
      load();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        showToast(err.response?.data?.message || 'Something went wrong.', 'error');
      }
    } finally {
      submitInFlight.current = false;
      setSubmitting(false);
    }
  }

  async function handleDelete(product) {
    if (deleteInFlight.current) return;
    deleteInFlight.current = product.id;

    setDeletingId(product.id);

    try {
      const response = await deleteProduct(product.id);
      showToast(response.data.message, 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete this product.', 'error');
    } finally {
      deleteInFlight.current = null;
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <h1>Products</h1>
        <button className="btn btn--primary" onClick={startCreate}>
          <PlusIcon /> Add Product
        </button>
      </div>

      {loading ? (
        <PageLoader label="Loading products..." />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th className="is-numeric">Price</th>
                <th>Status</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr className="admin-empty-row">
                  <td colSpan={5}>No products yet.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category?.name}</td>
                    <td className="is-numeric">${Number(product.price).toFixed(2)}</td>
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
                      <div className="admin-table__actions">
                        <button
                          className="icon-btn"
                          onClick={() => startEdit(product)}
                          title="Edit product"
                          aria-label="Edit product"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          className="icon-btn icon-btn--danger"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          title="Delete product"
                          aria-label="Delete product"
                        >
                          {deletingId === product.id ? <Spinner size="sm" /> : <TrashIcon />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <SlideOver
        open={panelOpen}
        onClose={closePanel}
        title={editingId ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit}>
          <label className="admin-field">
            <span className="admin-field__label">Name</span>
            <input
              type="text"
              className={`admin-field__input ${errors.name ? 'admin-field__input--invalid' : ''}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            {errors.name && <p className="admin-field__error">{errors.name[0]}</p>}
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Category</span>
            <select
              className={`admin-field__input ${
                errors.category_id ? 'admin-field__input--invalid' : ''
              }`}
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
            {errors.category_id && <p className="admin-field__error">{errors.category_id[0]}</p>}
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Description</span>
            <textarea
              className={`admin-field__input ${
                errors.description ? 'admin-field__input--invalid' : ''
              }`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
            {errors.description && <p className="admin-field__error">{errors.description[0]}</p>}
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Price</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`admin-field__input ${errors.price ? 'admin-field__input--invalid' : ''}`}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            {errors.price && <p className="admin-field__error">{errors.price[0]}</p>}
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Image URL</span>
            <input
              type="url"
              className={`admin-field__input ${
                errors.image_url ? 'admin-field__input--invalid' : ''
              }`}
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
            />
            {errors.image_url && <p className="admin-field__error">{errors.image_url[0]}</p>}
          </label>

          <label className="admin-field__checkbox">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active
          </label>

          <div className="admin-form-actions">
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting && <Spinner size="sm" />}
              {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Product'}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={closePanel}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
