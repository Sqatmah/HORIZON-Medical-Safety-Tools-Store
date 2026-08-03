import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
const STATUS_LABELS = {
  pending: 'قيد الانتظار', processing: 'قيد التجهيز', shipped: 'تم الشحن',
  delivered: 'تم التسليم', cancelled: 'ملغي', returned: 'مرتجع',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    apiClient.get('/orders/')
      .then((res) => setOrders(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await apiClient.patch(`/orders/${id}/`, { status: newStatus });
    loadData();
  };

  const handleTrackingChange = async (id, trackingNumber) => {
    await apiClient.patch(`/orders/${id}/`, { tracking_number: trackingNumber });
    loadData();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">إدارة الطلبات</h1>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">لا توجد طلبات بعد</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                <div>
                  <p className="font-bold text-teal-600">{order.order_number}</p>
                  <p className="text-sm text-gray-500">{order.customer_email} - {order.customer_phone}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString('ar-SA')}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">{order.total} ريال</p>
                  <p className="text-xs text-gray-400">
                    الدفع: {order.payment_method === 'cod' ? 'عند الاستلام' : order.payment_method}
                  </p>
                </div>
              </div>

              <div className="space-y-1 mb-4 text-sm text-gray-600">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name_ar} × {item.quantity}</span>
                    <span>{item.price} ريال</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 items-center border-t pt-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">حالة الطلب</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border rounded-lg px-3 py-1 text-sm"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">رقم التتبع</label>
                  <input
                    type="text"
                    defaultValue={order.tracking_number}
                    onBlur={(e) => handleTrackingChange(order.id, e.target.value)}
                    placeholder="أدخل رقم التتبع"
                    className="border rounded-lg px-3 py-1 text-sm w-40"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}