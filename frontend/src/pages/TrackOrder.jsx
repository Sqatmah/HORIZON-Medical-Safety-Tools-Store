import { useState } from 'react';
import apiClient from '../api/client';

const STATUS_STEPS = [
  { key: 'pending', label: 'قيد الانتظار' },
  { key: 'processing', label: 'قيد التجهيز' },
  { key: 'shipped', label: 'تم الشحن' },
  { key: 'delivered', label: 'تم التسليم' },
];

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await apiClient.get('/orders/track/', { params: { order_number: orderNumber.trim() } });
      setOrder(res.data);
    } catch (err) {
      setOrder(null);
      setError('لم يتم العثور على طلب بهذا الرقم');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;
  const isCancelled = order && ['cancelled', 'returned'].includes(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-brand-primary mb-2">تتبع طلبك</h1>
      <p className="text-gray-500 mb-8">أدخل رقم طلبك أو رقم التتبع لمعرفة حالة الشحن المباشرة</p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-12">
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition disabled:opacity-60"
        >
          {loading ? '...' : 'تتبع'}
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="رقم الطلب أو رقم التتبع"
            className="w-full border rounded-lg px-4 py-3 pr-10 text-right focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </div>
      </form>

      {!searched && (
        <div className="text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l-4-4m0 0l4-4m-4 4h16" />
          </svg>
          <p>أدخل رقم طلبك للبدء</p>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {order && !isCancelled && (
        <div className="bg-white rounded-2xl shadow p-8 text-right">
          <div className="flex justify-between items-center mb-8">
            <span className="text-teal-600 font-bold">{order.order_number}</span>
            <span className="text-gray-500 text-sm">{order.total} ريال</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            {STATUS_STEPS.map((step, i) => (
              <div key={step.key} className="flex-1 flex flex-col items-center relative">
                {i > 0 && (
                  <div
                    className={`absolute top-4 right-1/2 w-full h-1 -z-10 ${
                      i <= currentStepIndex ? 'bg-teal-500' : 'bg-gray-200'
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    i <= currentStepIndex ? 'bg-teal-500' : 'bg-gray-300'
                  }`}
                >
                  {i <= currentStepIndex ? '✓' : i + 1}
                </div>
                <span className={`text-xs mt-2 ${i <= currentStepIndex ? 'text-teal-700 font-semibold' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {order.tracking_number && (
            <p className="text-sm text-gray-500 mb-4">رقم التتبع: {order.tracking_number}</p>
          )}

          <div className="border-t pt-4 space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-600">
                <span>{item.name_ar} × {item.quantity}</span>
                <span>{item.price} ريال</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {order && isCancelled && (
        <div className="bg-red-50 text-red-600 rounded-2xl p-8">
          هذا الطلب {order.status === 'cancelled' ? 'ملغي' : 'مرتجع'}.
        </div>
      )}
    </div>
  );
}