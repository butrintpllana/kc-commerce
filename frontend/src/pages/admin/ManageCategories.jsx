import { useEffect, useRef, useState } from 'react';
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../../api/categories';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/common/Spinner';
import PageLoader from '../../components/common/PageLoader';
import SlideOver from '../../components/common/SlideOver';
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/admin/icons';
import '../../components/admin/admin-form.css';

const emptyForm = { name: '' };

export default function ManageCategories() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const submitInFlight = useRef(false);
  const deleteInFlight = useRef(null);

  function load() {
    setLoading(true);
    return fetchCategories()
      .then((response) => setCategories(response.data.data))
      .catch(() => setCategories([]))
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

  function startEdit(category) {
    setEditingId(category.id);
    setForm({ name: category.name });
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

    try {
      if (editingId) {
        await updateCategory(editingId, form);
        showToast('Category updated.', 'success');
      } else {
        await createCategory(form);
        showToast('Category created.', 'success');
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

  async function handleDelete(category) {
    if (deleteInFlight.current) return;
    deleteInFlight.current = category.id;

    setDeletingId(category.id);

    try {
      await deleteCategory(category.id);
      showToast(`"${category.name}" deleted.`, 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete this category.', 'error');
    } finally {
      deleteInFlight.current = null;
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <h1>Categories</h1>
        <button className="btn btn--primary" onClick={startCreate}>
          <PlusIcon /> Add Category
        </button>
      </div>

      {loading ? (
        <PageLoader label="Loading categories..." />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr className="admin-empty-row">
                  <td colSpan={2}>No categories yet.</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button
                          className="icon-btn"
                          onClick={() => startEdit(category)}
                          title="Edit category"
                          aria-label="Edit category"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          className="icon-btn icon-btn--danger"
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === category.id}
                          title="Delete category"
                          aria-label="Delete category"
                        >
                          {deletingId === category.id ? <Spinner size="sm" /> : <TrashIcon />}
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
        title={editingId ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit}>
          <label className="admin-field">
            <span className="admin-field__label">Name</span>
            <input
              type="text"
              className={`admin-field__input ${errors.name ? 'admin-field__input--invalid' : ''}`}
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              required
            />
            {errors.name && <p className="admin-field__error">{errors.name[0]}</p>}
          </label>

          <div className="admin-form-actions">
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting && <Spinner size="sm" />}
              {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Category'}
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
