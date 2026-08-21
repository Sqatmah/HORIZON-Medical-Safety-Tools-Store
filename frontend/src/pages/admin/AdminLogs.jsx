import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/logs/').then((res) => setLogs(res.data.results || res.data)).finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    const res = await apiClient.get('/logs/export/', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'activity_logs.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">سجل العمليات (Logs)</h1>
        <button onClick={handleExport} className="bg-brand-primary text-white px-5 py-2 rounded-lg hover:opacity-90">
          تصدير Excel
        </button>
      </div>
      {loading ? <p>جاري التحميل...</p> : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-right p-3">المستخدم</th>
                <th className="text-right p-3">العملية</th>
                <th className="text-right p-3">التفاصيل</th>
                <th className="text-right p-3">IP</th>
                <th className="text-right p-3">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t">
                  <td className="p-3">{log.username}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3 text-gray-500">{log.details}</td>
                  <td className="p-3 text-gray-400">{log.ip_address || '—'}</td>
                  <td className="p-3">{new Date(log.created_at).toLocaleString('ar-SA')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}