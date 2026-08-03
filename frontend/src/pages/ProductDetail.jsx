import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../api/entities';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };



  useEffect(() => {
    setLoading(true);
    Product.get(id)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center py-20 text-gray-500">جاري التحميل...</p>;
  }

  if (!product) {
    return <p className="text-center py-20 text-gray-500">المنتج غير موجود</p>;
  }

  const displayPrice = product.discount_price || product.price;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* الصورة */}
        <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={`http://127.0.0.1:8000${product.images[0].image}`}
              alt={product.name_ar}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">لا توجد صورة</span>
          )}
        </div>

        {/* التفاصيل */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name_ar}</h1>
          <p className="text-gray-400 mb-4">{product.name_en}</p>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-teal-600">{displayPrice} ريال</span>
            {product.discount_price && (
              <span className="text-gray-400 line-through">{product.price} ريال</span>
            )}
          </div>

          {product.short_desc_ar && (
            <p className="text-gray-600 mb-4">{product.short_desc_ar}</p>
          )}

          {/* شارات الامتثال */}
          <div className="flex gap-2 flex-wrap mb-6">
            {product.sfda_number && (
              <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">
                SFDA: {product.sfda_number}
              </span>
            )}
            {product.compliance_standard && (
              <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                {product.compliance_standard}
              </span>
            )}
          </div>

          {/* الكمية */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-700">الكمية:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 text-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {product.stock > 0 ? `متوفر (${product.stock})` : 'غير متوفر'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:bg-gray-300"
          >
            {added ? '✓ تمت الإضافة!' : 'أضف إلى السلة'}
          </button>

          {/* المواصفات */}
          {product.specs && product.specs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-3">المواصفات</h2>
              <table className="w-full text-sm border-t">
                {product.specs.map((spec, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 text-gray-500">{spec.key_ar}</td>
                    <td className="py-2 font-medium">{spec.value_ar}</td>
                  </tr>
                ))}
              </table>
            </div>
          )}
        </div>
      </div>

      {/* الوصف الكامل */}
      {product.desc_ar && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-3">الوصف</h2>
          <p className="text-gray-600 leading-relaxed">{product.desc_ar}</p>
        </div>
      )}
    </div>
  );
}