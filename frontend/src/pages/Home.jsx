import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, Category } from '../api/entities';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      Product.list({ is_featured: true }),
      Product.list({ is_best_seller: true }),
      Product.list({ is_new_arrival: true }),
      Category.list(),
    ])
      .then(([featuredData, bestData, newData, catData]) => {
        setFeatured(featuredData);
        setBestSellers(bestData);
        setNewArrivals(newData);
        setCategories(catData.filter((c) => c.is_active));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const ProductCard = ({ product }) => (
  <Link
    to={`/product/${product.id}`}
    className="product-card bg-white rounded-xl shadow p-4 block flex-shrink-0 w-56"
  >
    <div className="bg-gray-100 rounded-lg h-36 mb-3 flex items-center justify-center overflow-hidden">
      {product.images && product.images.length > 0 ? (
        <img
          src={product.images[0].image}
          alt={product.name_ar}
          className="product-card-image w-full h-full object-cover"
        />
      ) : (
        <span className="text-gray-400 text-xs">لا توجد صورة</span>
      )}
    </div>
    <h3 className="font-semibold text-gray-800 truncate">{product.name_ar}</h3>
    <p className="text-teal-600 font-bold mt-1">{product.price} ريال</p>
  </Link>
);

  const Section = ({ title, products }) =>
    products.length > 0 && (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <Link to="/products" className="text-teal-600 text-sm hover:underline">
            عرض الكل ←
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-2">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-l from-teal-700 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            معدات طبية وسلامة صناعية موثوقة
          </h1>
          <p className="text-lg text-teal-50 mb-8 max-w-2xl mx-auto">
            منتجات معتمدة من SFDA وSASO، بجودة عالمية وتوصيل سريع لجميع مناطق المملكة
          </p>
          <Link
            to="/products"
            className="bg-white text-teal-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition inline-block"
          >
            تصفّح المنتجات
          </Link>
        </div>
      </section>

      {/* التصنيفات */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">تصفّح حسب التصنيف</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 text-center"
              >
                <p className="font-semibold text-gray-700">{cat.name_ar}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {loading ? (
        <p className="text-center py-10 text-gray-500">جاري تحميل المنتجات...</p>
      ) : (
        <>
          <Section title="منتجات مميزة" products={featured} />
          <Section title="الأكثر مبيعًا" products={bestSellers} />
          <Section title="وصل حديثًا" products={newArrivals} />
        </>
      )}

      {/* شارات الثقة */}
      <section className="bg-gray-100 py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl mb-2">🏥</p>
            <h3 className="font-bold mb-1">معتمد من SFDA</h3>
            <p className="text-sm text-gray-500">جميع المنتجات مطابقة لمعايير هيئة الغذاء والدواء</p>
          </div>
          <div>
            <p className="text-3xl mb-2">🚚</p>
            <h3 className="font-bold mb-1">توصيل سريع</h3>
            <p className="text-sm text-gray-500">شحن لجميع مناطق المملكة مع تتبع حي للطلب</p>
          </div>
          <div>
            <p className="text-3xl mb-2">💵</p>
            <h3 className="font-bold mb-1">دفع مرن</h3>
            <p className="text-sm text-gray-500">الدفع عند الاستلام أو عبر وسائل الدفع الإلكترونية</p>
          </div>
        </div>
      </section>
    </div>
  );
}