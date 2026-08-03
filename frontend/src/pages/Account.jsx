import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

const STATUS_LABELS = {
  pending: 'قيد الانتظار',
  processing: 'قيد التجهيز',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  returned: 'مرتجع',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-gray-100 text-gray-700',
};

export default function Account() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get('/orders/')
      .then((res) => setOrders(res.data.results || res.data))
      .catch(() => setError('حدث خطأ أثناء جلب الطلبات'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">حسابي</h1>
      {user?.username && <p className="text-gray-500 mb-8">مرحبًا، {user.username}</p>}
      {user?.email && <p className="text-gray-500 mb-8">مرحبًا، {user.email}</p>}

      <h2 className="text-xl font-bold mb-4">طلباتي</h2>

      {loading ? (
        <p className="text-gray-500">جاري تحميل الطلبات...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">لا توجد طلبات بعد</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow rounded-lg p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-teal-600">{order.order_number}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}
                >
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name_ar} × {item.quantity}</span>
                    <span>{item.price} ريال</span>
                  </div>
                ))}
              </div>

              <hr className="mb-3" />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  الدفع: {order.payment_method === 'cod' ? 'عند الاستلام' : order.payment_method}
                </span>
                <span className="font-bold text-lg">{order.total} ريال</span>
              </div>

              {order.tracking_number && (
                <p className="text-xs text-gray-400 mt-2">
                  رقم التتبع: {order.tracking_number}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}