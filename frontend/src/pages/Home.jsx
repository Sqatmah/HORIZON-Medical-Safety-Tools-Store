import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, Category } from '../api/entities';
import apiClient from '../api/client';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState(null);

    useEffect(() => {
    Promise.all([
      Product.list({ is_featured: true }),
      Product.list({ is_best_seller: true }),
      Product.list({ is_new_arrival: true }),
      Category.list(),
      apiClient.get('/banners/'),
      apiClient.get('/catalog/'),
    ])
      .then(([featuredData, bestData, newData, catData, bannerRes, catalogRes]) => {
    
      
        setFeatured(featuredData);
        setBestSellers(bestData);
        setNewArrivals(newData);
        setCategories(catData.filter((c) => c.is_active));
        const bannerList = bannerRes.data.results || bannerRes.data;
        setBanners(bannerList.filter((b) => b.is_active));
        setCatalog(catalogRes.data.file ? catalogRes.data : null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

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
            {/* Hero Section - بانرات ديناميكية */}
      {banners.length > 0 ? (
        <section className="relative h-[420px] overflow-hidden">
          {banners.map((banner, i) => (
              <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === activeBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-accent" />
              {banner.image && (
                <img
                  src={banner.image}
                  alt={banner.title_ar}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}
              <div className="absolute inset-0 bg-brand-primary/50" />
              <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{banner.title_ar}</h1>
                {banner.subtitle_ar && (
                  <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">{banner.subtitle_ar}</p>
                )}
                <Link
                  to={banner.link || '/products'}
                  className="bg-white text-brand-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition inline-block"
                >
                  تصفّح المنتجات
                </Link>
              </div>
            </div>
          ))}

          {banners.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBanner(i)}
                  className={`w-2.5 h-2.5 rounded-full transition ${
                    i === activeBanner ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="bg-gradient-to-l from-brand-primary to-brand-accent text-white">
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">معدات طبية وسلامة صناعية موثوقة</h1>
            <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
              منتجات معتمدة من SFDA وSASO، بجودة عالمية وتوصيل سريع لجميع مناطق المملكة
            </p>
            <Link to="/products" className="bg-white text-brand-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition inline-block">
              تصفّح المنتجات
            </Link>
          </div>
        </section>
      )}

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



            {/* تحميل الكتالوج */}
      {catalog && (
        <section className="max-w-4xl mx-auto px-4 py-10">
                    <div className="catalog-glow bg-white border-2 border-brand-accent rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-brand-primary text-lg">كتالوج المنتجات الكامل</h3>
                <p className="text-sm text-gray-500">استعرض جميع منتجاتنا بصيغة PDF</p>
              </div>
            </div>
            
            <a
                          
              href={catalog.file}
              download
              className="bg-brand-accent text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition inline-flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              تحميل الكتالوج
            </a>
          </div>
        </section>
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