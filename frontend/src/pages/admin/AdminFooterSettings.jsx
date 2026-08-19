import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

export default function AdminFooterSettings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiClient.get('/footer-settings/')
      .then((res) => setForm(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await apiClient.put('/footer-settings/', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <p>جاري التحميل...</p>;

  const field = (key, label, type = 'text') => (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={form[key] || ''}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          rows={3}
          className="w-full border rounded-lg px-3 py-2"
        />
      ) : (
        <input
          type="text"
          value={form[key] || ''}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />
      )}
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">إعدادات الفوتر</h1>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow p-6 space-y-5 max-w-2xl">
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-700">نبذة عن المؤسسة</h3>
          {field('about_text', 'نص النبذة', 'textarea')}
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-700">معلومات التواصل</h3>
          {field('address', 'العنوان')}
          {field('phone', 'الهاتف')}
          {field('email', 'البريد الإلكتروني')}
          {field('working_hours', 'ساعات العمل')}
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-700">روابط التواصل الاجتماعي</h3>
          {field('facebook_url', 'رابط Facebook')}
          {field('linkedin_url', 'رابط LinkedIn')}
          {field('instagram_url', 'رابط Instagram')}
          {field('twitter_url', 'رابط Twitter')}
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-700">حقوق النشر</h3>
          {field('copyright_text', 'نص حقوق النشر')}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-60"
        >
          {saving ? 'جاري الحفظ...' : saved ? '✓ تم الحفظ' : 'حفظ التغييرات'}
        </button>
      </form>
    </div>
  );
}