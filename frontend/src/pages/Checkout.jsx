import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_email: user?.email || '',
    customer_phone: '',
    full_name: '',
    city: '',
    address_line: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  // لو مش مسجل دخول، ما يقدر يكمل الطلب
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول أولًا</h1>
        <button
          onClick={() => navigate('/login')}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  if (items.length === 0 && !orderResult) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">السلة فارغة</h1>
      </div>
    );
  }

  // لو الطلب نجح، اعرض شاشة التأكيد
  if (orderResult) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">تم استلام طلبك بنجاح!</h1>
        <p className="text-gray-500 mb-1">رقم الطلب:</p>
        <p className="text-teal-600 font-bold text-lg mb-6">{orderResult.order_number}</p>
        <p className="text-gray-500 text-sm mb-6">
          سيتواصل معك فريقنا قريبًا لتأكيد الطلب وترتيب الدفع عند الاستلام.
        </p>
        <button
          onClick={() => navigate('/account')}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
        >
          عرض طلباتي
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        shipping_cost: 15, // قيمة مبدئية ثابتة، رح نربطها بمناطق الشحن الحقيقية لاحقًا
        payment_method: 'cod', // دفع عند الاستلام افتراضيًا
        shipping_address: {
          full_name: formData.full_name,
          city: formData.city,
          address_line: formData.address_line,
        },
      };

      const res = await apiClient.post('/orders/', payload);
      setOrderResult(res.data);
      clearCart();
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = 15;
  const vatEstimate = ((subtotal + shippingCost) * 0.15).toFixed(2);
  const totalEstimate = (subtotal + shippingCost + Number(vatEstimate)).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* فورم بيانات الشحن */}
      <div>
        <h1 className="text-2xl font-bold mb-6">بيانات الشحن</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded">{error}</p>}

          <div>
            <label className="block text-sm text-gray-600 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={formData.customer_email}
              onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">رقم الجوال</label>
            <input
              type="text"
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">الاسم الكامل</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">المدينة</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">العنوان التفصيلي</label>
            <textarea
              value={formData.address_line}
              onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="bg-gray-50 border rounded-lg px-4 py-3 text-sm text-gray-600">
            💵 طريقة الدفع: <strong>الدفع عند الاستلام (COD)</strong>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:bg-gray-300"
          >
            {loading ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
          </button>
        </form>
      </div>

      {/* ملخص الطلب */}
      <div>
        <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
        <div className="bg-white shadow rounded-lg p-6 space-y-3">
          {items.map((item) => (
            <div key={item.product_id} className="flex justify-between text-sm">
              <span>{item.name_ar} × {item.quantity}</span>
              <span>{(item.price * item.quantity).toFixed(2)} ريال</span>
            </div>
          ))}
          <hr />
          <div className="flex justify-between text-sm">
            <span>المجموع الفرعي</span>
            <span>{subtotal.toFixed(2)} ريال</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>الشحن</span>
            <span>{shippingCost.toFixed(2)} ريال</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>ضريبة القيمة المضافة (تقديرية 15%)</span>
            <span>{vatEstimate} ريال</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg text-teal-600">
            <span>المجموع الكلي (تقديري)</span>
            <span>{totalEstimate} ريال</span>
          </div>
          <p className="text-xs text-gray-400">
            * المبلغ النهائي يُحسب رسميًا من الخادم عند تأكيد الطلب
          </p>
        </div>
      </div>
    </div>
  );
}