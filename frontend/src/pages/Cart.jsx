import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">السلة فارغة</h1>
        <Link to="/products" className="text-teal-600 hover:underline">
          تصفّح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">سلة المشتريات</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product_id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className="bg-gray-100 rounded w-20 h-20 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.name_ar} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs">لا توجد صورة</span>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{item.name_ar}</h3>
              <p className="text-teal-600 font-bold">{item.price} ريال</p>
            </div>

            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                className="px-3 py-1 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                className="px-3 py-1 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.product_id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              حذف
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>المجموع الفرعي</span>
          <span>{subtotal.toFixed(2)} ريال</span>
        </div>
        <p className="text-gray-400 text-sm mb-4">* سيتم إضافة الشحن والضريبة (VAT 15%) عند إتمام الطلب</p>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          إتمام الطلب
        </button>
      </div>
    </div>
  );
}