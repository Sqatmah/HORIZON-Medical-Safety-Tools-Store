import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const TABS = [
  { key: 'sales', label: 'المبيعات' },
  { key: 'products', label: 'المنتجات' },
  { key: 'customers', label: 'العملاء' },
  { key: 'orders', label: 'الطلبات' },
];

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState('sales');
  const [data, setData] = useState(null);
  const [visitorStats, setVisitorStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    apiClient.get('/visitor-stats/').then((res) => setVisitorStats(res.data));
    const interval = setInterval(() => {
      apiClient.get('/visitor-stats/').then((res) => setVisitorStats(res.data));
    }, 15000); // تحديث كل 15 ثانية
    return () => clearInterval(interval);
  }, []);

    useEffect(() => {
    setLoading(true);
    setData(null);
    apiClient.get(`/reports/${activeTab}/`)
      .then((res) => setData(res.data))
      .catch(() => setData(activeTab === 'sales' ? {} : []))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await apiClient.get(`/reports/export/${activeTab}/`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeTab}_report.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('حدث خطأ أثناء تصدير التقرير');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">التقارير</h1>

      {/* عداد الزوار الحي */}
      {visitorStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">{visitorStats.visits_today}</p>
            <p className="text-xs text-gray-500 mt-1">زيارات اليوم</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">{visitorStats.unique_sessions_today}</p>
            <p className="text-xs text-gray-500 mt-1">زوار فريدون اليوم</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">{visitorStats.visits_last_7_days}</p>
            <p className="text-xs text-gray-500 mt-1">آخر 7 أيام</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">{visitorStats.visits_total}</p>
            <p className="text-xs text-gray-500 mt-1">إجمالي الزيارات</p>
          </div>
        </div>
      )}

      {/* التبويبات */}
      <div className="flex gap-2 mb-6 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
              activeTab === tab.key
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="mr-auto bg-brand-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {exporting ? 'جاري التصدير...' : 'تصدير Excel'}
        </button>
      </div>

        {loading || !data ? (
        <p className="text-gray-500">جاري التحميل...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {activeTab === 'sales' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
              <Stat label="عدد الطلبات" value={data.total_orders} />
              <Stat label="إجمالي الإيرادات" value={`${Number(data.total_revenue).toFixed(2)} ريال`} />
              <Stat label="إجمالي الضريبة" value={`${Number(data.total_vat_collected).toFixed(2)} ريال`} />
              <Stat label="متوسط قيمة الطلب" value={`${Number(data.average_order_value).toFixed(2)} ريال`} />
            </div>
          )}

                    {activeTab === 'products' && (
            <Table
              headers={['المنتج', 'SKU', 'السعر', 'المخزون', 'مبيعات', 'تقييم', 'الحالة']}
              rows={Array.isArray(data) ? data.map((p) => [p.name_ar, p.sku || '—', `${p.price} ريال`, p.stock, p.quantity_sold, p.rating_avg || '—', p.status]) : []}
            />
          )}

          {activeTab === 'customers' && (
            <Table
              headers={['اسم المستخدم', 'البريد', 'نوع العميل', 'عدد الطلبات', 'إجمالي الإنفاق']}
              rows={Array.isArray(data) ? data.map((c) => [c.username, c.email, c.customer_type, c.total_orders, `${Number(c.total_spent).toFixed(2)} ريال`]) : []}
            />
          )}

          {activeTab === 'orders' && (
            <Table
              headers={['رقم الطلب', 'البريد', 'الحالة', 'الدفع', 'المجموع']}
              rows={Array.isArray(data) ? data.map((o) => [o.order_number, o.customer_email, o.status, o.payment_status, `${o.total} ريال`]) : []}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-brand-primary">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-100 text-gray-600">
        <tr>
          {headers.map((h) => (
            <th key={h} className="text-right p-3">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={headers.length} className="p-4 text-center text-gray-400">لا توجد بيانات</td></tr>
        ) : (
          rows.map((row, i) => (
            <tr key={i} className="border-t">
              {row.map((cell, j) => <td key={j} className="p-3">{cell}</td>)}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}