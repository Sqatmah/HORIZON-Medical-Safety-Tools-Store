import { useState } from 'react';
import apiClient from '../api/client';

export default function Contact() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/contact-messages/', form);
      setSent(true);
      setForm({ full_name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError('حدث خطأ أثناء إرسال الرسالة، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#0B253D] mb-10">اتصل بنا</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold text-[#0B253D] mb-6">معلومات الاتصال</h2>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">العنوان</p>
                <p className="text-gray-500 text-sm">الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">الهاتف</p>
                <p className="text-gray-500 text-sm">+966 50 000 0000</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">البريد الإلكتروني</p>
                <p className="text-gray-500 text-sm">info@horizoncare.sa</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#0B253D] mb-6">أرسل لنا رسالة</h2>

          {sent ? (
            <div className="bg-teal-50 text-teal-700 rounded-lg p-4">
              تم إرسال رسالتك بنجاح، سنتواصل معك قريبًا.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded">{error}</p>}
              <input
                type="text" placeholder="الاسم الكامل" required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="email" placeholder="البريد الإلكتروني" required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text" placeholder="الهاتف"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <textarea
                placeholder="رسالتك..." required rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit" disabled={loading}
                className="bg-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition flex items-center gap-2 disabled:opacity-60"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}