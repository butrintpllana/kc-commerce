import { useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../../api/categories';

const emptyForm = { name: '' };

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

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

  function startEdit(category) {
    setEditingId(category.id);
    setForm({ name: category.name });
    setErrors({});
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});

    try {
      if (editingId) {
        await updateCategory(editingId, form);
        setToast({ type: 'success', message: 'Category updated.' });
      } else {
        await createCategory(form);
        setToast({ type: 'success', message: 'Category created.' });
      }

      cancelEdit();
      load();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setToast({ type: 'error', message: err.response?.data?.message || 'Something went wrong.' });
      }
    }
  }

  async function handleDelete(category) {
    setToast(null);

    try {
      await deleteCategory(category.id);
      setToast({ type: 'success', message: `"${category.name}" deleted.` });
      load();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Could not delete this category.',
      });
    }
  }

  return (
    <div>
      <h1>Categories</h1>

      {toast && <div className={`toast toast--${toast.type}`}>{toast.message}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Category' : 'Add Category'}</h3>
        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            required
          />
          {errors.name && <p className="field-error">{errors.name[0]}</p>}
        </label>
        <div className="admin-form__actions">
          <button type="submit" className="btn btn--primary">
            {editingId ? 'Save Changes' : 'Add Category'}
          </button>
          {editingId && (
            <button type="button" className="btn btn--secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <button className="btn btn--secondary" onClick={() => startEdit(category)}>
                    Edit
                  </button>{' '}
                  <button className="btn btn--danger" onClick={() => handleDelete(category)}>
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
