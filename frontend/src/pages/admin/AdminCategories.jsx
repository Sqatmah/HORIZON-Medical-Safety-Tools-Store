import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const emptyForm = { name_en: '', name_ar: '', slug: '', description_ar: '', is_active: true, sort_order: 0 };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState(null);

  const loadData = () => {
    setLoading(true);
    apiClient.get('/categories/')
      .then((res) => setCategories(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (cat) => {
    setForm({
      name_en: cat.name_en, name_ar: cat.name_ar, slug: cat.slug,
      description_ar: cat.description_ar || '',
      is_active: cat.is_active, sort_order: cat.sort_order,
    });
    setImageFile(null);
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleNameChange = (value) => {
    const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm({ ...form, name_en: value, slug });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingId) {
        await apiClient.patch(`/categories/${editingId}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await apiClient.post('/categories/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      setError('حدث خطأ، تأكد من صحة البيانات (يمكن الرابط مستخدم من قبل)');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('متأكد من حذف هذا التصنيف؟')) return;
    try {
      await apiClient.delete(`/categories/${id}/`);
      loadData();
    } catch (err) {
      alert('لا يمكن حذف تصنيف مرتبط بمنتجات موجودة');
    }
  };

  const handleToggleActive = async (id, current) => {
    await apiClient.patch(`/categories/${id}/`, { is_active: !current });
    loadData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة التصنيفات</h1>
        <button
          onClick={openNewForm}
          className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700"
        >
          + إضافة تصنيف
        </button>
      </div>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-right p-3">الاسم</th>
                <th className="text-right p-3">الترتيب</th>
                <th className="text-right p-3">نشط؟</th>
                <th className="text-right p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t">
                  <td className="p-3">{cat.name_ar} <span className="text-gray-400 text-xs">({cat.name_en})</span></td>
                  <td className="p-3">{cat.sort_order}</td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={cat.is_active}
                      onChange={() => handleToggleActive(cat.id, cat.is_active)}
                      className="w-4 h-4 accent-teal-600"
                    />
                  </td>
                  <td className="p-3 space-x-2 space-x-reverse">
                    <button onClick={() => openEditForm(cat)} className="text-teal-600 hover:underline">تعديل</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'تعديل تصنيف' : 'إضافة تصنيف'}</h2>

            {error && <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">الاسم (إنجليزي)</label>
                <input
                  type="text"
                  value={form.name_en}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">الاسم (عربي)</label>
                <input
                  type="text"
                  value={form.name_ar}
                  onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">الرابط (slug)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">ترتيب العرض</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                              <div>
                <label className="block text-sm text-gray-600 mb-1">وصف قصير (يظهر بالكارد)</label>
                <textarea
                  value={form.description_ar}
                  onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">صورة التصنيف</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 accent-teal-600"
                />
                نشط
              </label>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">
                  حفظ
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}