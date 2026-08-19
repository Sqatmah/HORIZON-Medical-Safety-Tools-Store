import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

export default function AdminCatalog() {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const loadData = () => {
    apiClient.get('/catalog/')
      .then((res) => setCatalog(res.data.file ? res.data : null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await apiClient.post('/catalog/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFile(null);
      loadData();
    } catch (err) {
      alert('حدث خطأ أثناء رفع الملف، تأكد أنه بصيغة PDF');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">إدارة كتالوج المنتجات</h1>

      <div className="bg-white rounded-xl shadow p-6 max-w-xl space-y-5">
        {loading ? (
          <p>جاري التحميل...</p>
        ) : catalog ? (
          <div className="border rounded-lg p-4 bg-teal-50">
            <p className="font-semibold text-teal-800">✓ يوجد كتالوج حالي</p>
            <p className="text-sm text-gray-500 mt-1">
              تمت الإضافة بتاريخ: {new Date(catalog.uploaded_at).toLocaleString('ar-SA')}
            </p>
            <a href={catalog.file} target="_blank" rel="noreferrer" className="text-teal-600 text-sm hover:underline mt-2 inline-block">
              عرض الملف الحالي
            </a>
          </div>
        ) : (
          <p className="text-gray-400">لا يوجد كتالوج مرفوع حاليًا</p>
        )}

        <form onSubmit={handleUpload} className="space-y-3">
          <label className="block text-sm text-gray-600">
            {catalog ? 'استبدال الكتالوج بنسخة جديدة (PDF)' : 'رفع كتالوج جديد (PDF)'}
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            disabled={!file || uploading}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            {uploading ? 'جاري الرفع...' : catalog ? 'استبدال الكتالوج' : 'رفع الكتالوج'}
          </button>
        </form>
      </div>
    </div>
  );
}