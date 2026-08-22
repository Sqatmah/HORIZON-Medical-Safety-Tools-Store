import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0 });
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    Promise.all([
      apiClient.get('/products/'),
      apiClient.get('/orders/'),
      apiClient.get('/categories/'),
    ]).then(([productsRes, ordersRes, categoriesRes]) => {
      const products = productsRes.data.results || productsRes.data;
      const orders = ordersRes.data.results || ordersRes.data;
      const categories = categoriesRes.data.results || categoriesRes.data;
      setStats({
        products: products.length,
        orders: orders.length,
        categories: categories.length,
      });
    });
  }, []);

  useEffect(() => {
    const loadLogs = () => {
      apiClient.get('/logs/recent/').then((res) => setRecentLogs(res.data)).catch(() => {});
    };
    loadLogs();
    const interval = setInterval(loadLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm mb-1">إجمالي المنتجات</p>
          <p className="text-3xl font-bold text-teal-600">{stats.products}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm mb-1">إجمالي الطلبات</p>
          <p className="text-3xl font-bold text-teal-600">{stats.orders}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm mb-1">إجمالي التصنيفات</p>
          <p className="text-3xl font-bold text-teal-600">{stats.categories}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-800">آخر العمليات على الموقع</h2>
          <span className="flex items-center gap-1.5 text-xs text-teal-600">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            مباشر
          </span>
        </div>

        {recentLogs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">لا توجد عمليات مسجلة بعد</p>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2.5 border-b last:border-b-0 text-sm">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    log.action.includes('طلب') ? 'bg-teal-500' :
                    log.action.includes('دخول') ? 'bg-blue-400' :
                    log.action.includes('حذف') ? 'bg-red-500' : 'bg-gray-400'
                  }`}></span>
                  <div>
                    <p className="text-gray-800 font-medium">{log.action}</p>
                    {log.details && <p className="text-gray-400 text-xs">{log.details}</p>}
                  </div>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className="text-gray-500 text-xs">{log.username}</p>
                  <p className="text-gray-400 text-xs">{new Date(log.created_at).toLocaleString('ar-SA')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}