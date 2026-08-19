import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const emptyForm = { title_ar: '', title_en: '', subtitle_ar: '', link: '', sort_order: 0, is_active: true };

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);

  const loadData = () => {
    setLoading(true);
    apiClient.get('/banners/')
      .then((res) => setBanners(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const openNewForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (banner) => {
    setForm({
      title_ar: banner.title_ar, title_en: banner.title_en || '',
      subtitle_ar: banner.subtitle_ar || '', link: banner.link || '',
      sort_order: banner.sort_order, is_active: banner.is_active,
    });
    setImageFile(null);
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingId) {
        await apiClient.patch(`/banners/${editingId}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await apiClient.post('/banners/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ، تأكد من رفع صورة عند إضافة بانر جديد');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('متأكد من حذف هذا البانر؟')) return;
    await apiClient.delete(`/banners/${id}/`);
    loadData();
  };

  const handleToggleActive = async (id, current) => {
    await apiClient.patch(`/banners/${id}/`, { is_active: !current });
    loadData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة البانرات</h1>
        <button onClick={openNewForm} className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700">
          + إضافة بانر
        </button>
      </div>

      {loading ? <p>جاري التحميل...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="h-32 bg-gray-100">
                {banner.image && <img src={banner.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <h3 className="font-bold">{banner.title_ar}</h3>
                <p className="text-sm text-gray-500 mb-3">{banner.subtitle_ar}</p>
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={banner.is_active} onChange={() => handleToggleActive(banner.id, banner.is_active)} className="accent-teal-600" />
                    نشط
                  </label>
                  <div className="space-x-2 space-x-reverse text-sm">
                    <button onClick={() => openEditForm(banner)} className="text-teal-600 hover:underline">تعديل</button>
                    <button onClick={() => handleDelete(banner.id)} className="text-red-500 hover:underline">حذف</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'تعديل بانر' : 'إضافة بانر'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="العنوان (عربي)" required value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input type="text" placeholder="العنوان (إنجليزي)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input type="text" placeholder="النص الفرعي" value={form.subtitle_ar} onChange={(e) => setForm({ ...form, subtitle_ar: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input type="text" placeholder="رابط عند الضغط (اختياري)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input type="number" placeholder="ترتيب العرض" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <div>
                <label className="block text-sm text-gray-600 mb-1">صورة البانر</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-teal-600" />
                نشط
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">حفظ</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}