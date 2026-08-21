import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, Category } from '../api/entities';
import apiClient from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/translations';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation(language);
  

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
      {product.rating_avg > 0 && (
        <div className="mt-1">
          <StarRating rating={product.rating_avg} size="text-xs" />
        </div>
      )}
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
      const handleDownloadCatalog = async () => {
    if (!catalog?.file) return;
    setDownloading(true);
    try {
      const response = await fetch(catalog.file);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'horizon-care-catalog.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('حدث خطأ أثناء تحميل الملف، حاول مرة أخرى');
    } finally {
      setDownloading(false);
    }
  };

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
                <span className="bg-white/15 backdrop-blur-sm border border-white/30 text-white text-xs px-4 py-1.5 rounded-full mb-4 flex items-center gap-1">
                  ✓ معتمد SFDA & SASO
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{banner.title_ar}</h1>
                {banner.subtitle_ar && (
                  <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">{banner.subtitle_ar}</p>
                )}
                                <div className="flex gap-3">
                  <Link to="/category" className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition">
                    استكشف الفئات
                  </Link>
                  <Link to={banner.link || '/products'} className="bg-gradient-to-l from-brand-primary to-brand-accent text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition inline-flex items-center gap-2">
                    ← تسوق الآن
                  </Link>
                </div>
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
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('heroTitle')}</h1>
            <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">{t('heroSubtitle')}</p>
            <Link to="/products" className="bg-white text-brand-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition inline-block">
              {t('browseProducts')}
            </Link>
          </div>
        </section>
      )}

            {/* التصنيفات */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-brand-primary mb-6 text-center">تصفّح حسب التصنيف</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="category-card-glow relative rounded-2xl overflow-hidden h-72 block group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-accent" />
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name_ar}
                    className="absolute inset-0 w-full h-full object-cover category-card-image blur-[1px] group-hover:blur-0 transition-all duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/85 via-brand-primary/20 to-transparent" />
                <div className="absolute bottom-0 right-0 p-6 text-white text-right w-full">
                  <h3 className="text-xl font-bold mb-1">{cat.name_ar}</h3>
                  <span className="inline-flex items-center gap-1 text-brand-accent text-xs font-semibold">
                    تسوق الآن
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </span>
                </div>
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

            {/* تحميل الكتالوج + الاستفسار */}
      {catalog && (
        <section className="max-w-4xl mx-auto px-4 py-10">
          <div className="catalog-glow bg-white border-2 border-brand-accent rounded-2xl p-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={handleDownloadCatalog}
                  disabled={downloading}
                  className="bg-brand-accent text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {downloading ? 'جاري التحميل...' : 'تحميل الكتالوج'}
                </button>

                <a
                  href="https://wa.me/966566586282"
                  target="_blank"
                  rel="noreferrer"
                  className="inquiry-glow bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.876.512 3.63 1.403 5.136L2 22l4.99-1.378A9.945 9.945 0 0012.001 22c5.522 0 10-4.477 10-10S17.523 2 12.001 2zm0 18.062a8.03 8.03 0 01-4.32-1.267l-.31-.185-3.211.887.86-3.15-.203-.323A8.028 8.028 0 013.938 12c0-4.454 3.61-8.062 8.063-8.062 4.453 0 8.062 3.608 8.062 8.062 0 4.454-3.61 8.062-8.062 8.062z" />
                  </svg>
                  للاستفسار
                </a>
              </div>
            </div>
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