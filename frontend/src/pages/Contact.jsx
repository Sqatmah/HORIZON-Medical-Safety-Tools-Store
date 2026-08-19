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
      <h1 className="text-3xl font-bold text-brand-primary mb-10">اتصل بنا</h1>

      <a
        href="https://wa.me/966566586282"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1DA851] transition shadow-lg mb-10"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.876.512 3.63 1.403 5.136L2 22l4.99-1.378A9.945 9.945 0 0012.001 22c5.522 0 10-4.477 10-10S17.523 2 12.001 2zm0 18.062a8.03 8.03 0 01-4.32-1.267l-.31-.185-3.211.887.86-3.15-.203-.323A8.028 8.028 0 013.938 12c0-4.454 3.61-8.062 8.063-8.062 4.453 0 8.062 3.608 8.062 8.062 0 4.454-3.61 8.062-8.062 8.062z" />
        </svg>
        تواصل معنا عبر واتساب
      </a>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold text-brand-primary mb-6">معلومات الاتصال</h2>
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
                <p className="text-gray-500 text-sm">+966 56 658 6282</p>
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
                <p className="text-gray-500 text-sm">info@techinnovation.sa</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-brand-primary mb-6">أرسل لنا رسالة</h2>

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