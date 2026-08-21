import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const emptyForm = {
  recipient_name: '', recipient_email: '', recipient_type: 'individual',
  purpose: 'quotation', amount: '', quantity: '', notes: '',
};

export default function AdminCorrespondence() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    apiClient.get('/correspondence/').then((res) => setItems(res.data.results || res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiClient.post('/correspondence/', form);
    setShowForm(false);
    setForm(emptyForm);
    loadData();
    handleDownload(res.data.id);
  };

  const handleDownload = async (id) => {
    const res = await apiClient.get(`/correspondence/${id}/?download=docx`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `correspondence_${id}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">المراسلات الاحترافية</h1>
        <button onClick={() => setShowForm(true)} className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700">
          + مراسلة جديدة
        </button>
      </div>

      {loading ? <p>جاري التحميل...</p> : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-right p-3">الجهة</th>
                <th className="text-right p-3">النوع</th>
                <th className="text-right p-3">الغرض</th>
                <th className="text-right p-3">المبلغ</th>
                <th className="text-right p-3">التاريخ</th>
                <th className="text-right p-3">تحميل</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.recipient_name}</td>
                  <td className="p-3">{c.recipient_type === 'individual' ? 'شخصي' : c.recipient_type === 'company' ? 'شركة' : 'جهة حكومية'}</td>
                  <td className="p-3">{c.purpose === 'quotation' ? 'عرض سعر' : 'تأكيد طلبية'}</td>
                  <td className="p-3">{c.amount ? `${c.amount} ريال` : '—'}</td>
                  <td className="p-3">{new Date(c.created_at).toLocaleDateString('ar-SA')}</td>
                  <td className="p-3">
                    <button onClick={() => handleDownload(c.id)} className="text-teal-600 hover:underline">تحميل Word</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">مراسلة جديدة</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="اسم الجهة/العميل" required value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input type="email" placeholder="البريد الإلكتروني" required value={form.recipient_email} onChange={(e) => setForm({ ...form, recipient_email: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <select value={form.recipient_type} onChange={(e) => setForm({ ...form, recipient_type: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                <option value="individual">عميل شخصي</option>
                <option value="company">شركة</option>
                <option value="government">جهة حكومية</option>
              </select>
              <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                <option value="quotation">تقديم عرض سعر</option>
                <option value="order_confirmation">تأكيد على طلبية</option>
              </select>
              <input type="number" placeholder="القيمة (ريال)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input type="number" placeholder="الكمية" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <textarea placeholder="ملاحظات" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full border rounded-lg px-3 py-2" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">إنشاء وتحميل Word</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}