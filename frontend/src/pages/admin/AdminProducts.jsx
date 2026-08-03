import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const emptyForm = {
  name_en: '', name_ar: '', slug: '', price: '', stock: 0,
  category: '', status: 'draft', short_desc_ar: '', desc_ar: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([apiClient.get('/products/'), apiClient.get('/categories/')])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data.results || prodRes.data);
        setCategories(catRes.data.results || catRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setForm({
      name_en: product.name_en, name_ar: product.name_ar, slug: product.slug,
      price: product.price, stock: product.stock, category: product.category,
      status: product.status, short_desc_ar: product.short_desc_ar || '',
      desc_ar: product.desc_ar || '',
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await apiClient.patch(`/products/${editingId}/`, form);
      } else {
        await apiClient.post('/products/', form);
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      setError('حدث خطأ، تأكد من تعبئة كل الحقول المطلوبة بشكل صحيح');
      console.error(err.response?.data);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('متأكد من حذف هذا المنتج؟')) return;
    await apiClient.delete(`/products/${id}/`);
    loadData();
  };

  // تغيير الحالة مباشرة من الجدول (inline)
  const handleStatusChange = async (id, newStatus) => {
    await apiClient.patch(`/products/${id}/`, { status: newStatus });
    loadData();
  };

  // توليد slug تلقائيًا من الاسم الإنجليزي
  const handleNameChange = (value) => {
    const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm({ ...form, name_en: value, slug });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
        <button
          onClick={openNewForm}
          className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700"
        >
          + إضافة منتج
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
                <th className="text-right p-3">السعر</th>
                <th className="text-right p-3">المخزون</th>
                <th className="text-right p-3">الحالة</th>
                <th className="text-right p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-3">{product.name_ar}</td>
                  <td className="p-3">{product.price} ريال</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">
                    <select
                      value={product.status}
                      onChange={(e) => handleStatusChange(product.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="published">منشور</option>
                      <option value="draft">مسودة</option>
                      <option value="hidden">مخفي</option>
                    </select>
                  </td>
                  <td className="p-3 space-x-2 space-x-reverse">
                    <button
                      onClick={() => openEditForm(product)}
                      className="text-teal-600 hover:underline"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:underline"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* فورم الإضافة/التعديل — نافذة منبثقة بسيطة */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'تعديل منتج' : 'إضافة منتج جديد'}
            </h2>

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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">السعر</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">المخزون</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">التصنيف</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">اختر تصنيف</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">الحالة</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                  <option value="hidden">مخفي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">وصف قصير</label>
                <input
                  type="text"
                  value={form.short_desc_ar}
                  onChange={(e) => setForm({ ...form, short_desc_ar: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">الوصف الكامل</label>
                <textarea
                  value={form.desc_ar}
                  onChange={(e) => setForm({ ...form, desc_ar: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
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