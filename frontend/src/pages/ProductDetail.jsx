import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../api/entities';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    Product.get(id).then(setProduct).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-20 text-gray-500">جاري التحميل...</p>;
  if (!product) return <p className="text-center py-20 text-gray-500">المنتج غير موجود</p>;

  const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);
  const discountPercent = hasDiscount ? Math.round(100 - (Number(product.discount_price) / Number(product.price)) * 100) : 0;
  const displayPrice = hasDiscount ? product.discount_price : product.price;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-accent">الرئيسية</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-accent">المنتجات</Link>
        <span>/</span>
        <span className="text-gray-700">{product.name_ar}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* التفاصيل */}
        <div className="order-2 md:order-1">
          {product.brand && <p className="text-gray-400 text-xs font-bold tracking-wide mb-1 uppercase">{product.brand}</p>}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name_ar}</h1>

          {(product.rating_avg > 0 || product.quantity_sold > 0) && (
            <div className="flex items-center gap-3 mb-3 text-sm">
              {product.rating_avg > 0 && (
                <div className="flex items-center gap-1">
                  <StarRating rating={product.rating_avg} />
                  <span className="text-gray-500">({product.rating_count || 0} التقييمات)</span>
                </div>
              )}
              {product.quantity_sold > 0 && <span className="text-gray-500">تم بيعه {product.quantity_sold}+</span>}
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            {hasDiscount && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">-{discountPercent}%</span>
            )}
            <span className="text-2xl font-bold text-brand-primary">{displayPrice} ر.س</span>
            {hasDiscount && <span className="text-gray-400 line-through">{product.price} ر.س</span>}
          </div>

          {product.short_desc_ar && <p className="text-gray-600 mb-3">{product.short_desc_ar}</p>}
          {product.sku && <p className="text-gray-400 text-sm mb-4">SKU: {product.sku}</p>}

          <p className="text-sm mb-6">
            {product.stock > 0 ? (
              <span className="text-teal-600 font-medium flex items-center gap-1">✓ متوفر</span>
            ) : (
              <span className="text-red-500 font-medium">غير متوفر</span>
            )}
          </p>

          <div className="flex items-center gap-3 mb-6">
            <button className="w-10 h-10 border rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342a4 4 0 100-2.684m0 2.684a4 4 0 100 2.684m0-2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a4 4 0 105.632-5.632 4 4 0 00-5.632 5.632zm0 12a4 4 0 105.632 5.632 4 4 0 00-5.632-5.632z" /></svg>
            </button>
            <button className="w-10 h-10 border rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2m-9 0v14a2 2 0 002 2h6a2 2 0 002-2V6" /></svg>
            </button>
            <button className="w-10 h-10 border rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-gradient-to-l from-brand-primary to-brand-accent text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-40"
            >
              {added ? '✓ تمت الإضافة!' : 'أضف إلى السلة'}
            </button>

            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2">+</button>
              <span className="px-3">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2">-</button>
            </div>
          </div>

          {/* شارات الثقة */}
          <div className="grid grid-cols-3 gap-3 border-t pt-5">
            <div className="text-center">
              <svg className="w-6 h-6 mx-auto mb-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <p className="text-xs text-gray-500">إرجاع</p>
              <p className="text-xs font-semibold text-gray-700">14 يوم</p>
            </div>
            <div className="text-center">
              <svg className="w-6 h-6 mx-auto mb-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5" /></svg>
              <p className="text-xs text-gray-500">الشحن</p>
              <p className="text-xs font-semibold text-gray-700">جميع المناطق</p>
            </div>
            <div className="text-center">
              <svg className="w-6 h-6 mx-auto mb-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-xs text-gray-500">SFDA</p>
              <p className="text-xs font-semibold text-gray-700">{product.sfda_number || 'معتمد'}</p>
            </div>
          </div>
        </div>

        {/* الصورة */}
        <div className="order-1 md:order-2">
          <div className="relative bg-gray-100 rounded-xl h-96 flex items-center justify-center overflow-hidden mb-3 group">
            {hasDiscount && (
              <span className="absolute top-4 right-4 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">-{discountPercent}%</span>
            )}
            {product.is_best_seller && (
              <span className="absolute top-4 left-4 z-10 bg-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-md">الأكثر مبيعًا</span>
            )}
            {product.images?.length > 0 ? (
              <img
                src={product.images[activeImage].image}
                alt={product.name_ar}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <span className="text-gray-400">لا توجد صورة</span>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    activeImage === i ? 'border-brand-accent' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {product.compliance_standard && (
        <div className="mt-12 border-t pt-6">
          <h2 className="text-lg font-bold mb-3 text-brand-primary">الامتثال والشهادات</h2>
          <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-sm px-4 py-2 rounded-full">
            ✓ معتمد ومطابق — {product.compliance_standard}
          </span>
        </div>
      )}

      {product.specs?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-3">المواصفات</h2>
          <table className="w-full text-sm border-t">
            <tbody>
              {product.specs.map((spec, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 text-gray-500">{spec.key_ar}</td>
                  <td className="py-2 font-medium">{spec.value_ar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {product.desc_ar && (
        <div className="mt-8 border-t pt-8">
          <h2 className="text-xl font-bold mb-3">الوصف</h2>
          <p className="text-gray-600 leading-relaxed">{product.desc_ar}</p>
        </div>
      )}
    </div>
  );
}