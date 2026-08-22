import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, Category } from '../api/entities';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/translations';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [ordering, setOrdering] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    Category.list().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (search) params.search = search;
    if (ordering) params.ordering = ordering;

    Product.list(params)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, search, ordering]);

  const selectCategory = (id) => {
    setSelectedCategory(id);
    setSearchParams(id ? { category: id } : {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-primary mb-1">{t('productsTitle')}</h1>
      <p className="text-gray-500 mb-6">{t('productsCount')} {products.length} {t('productItem')}</p>
      {/* شريط الأدوات */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 ${viewMode === 'list' ? 'bg-brand-primary text-white' : 'bg-white text-gray-500'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-brand-primary text-white' : 'bg-white text-gray-500'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h4v4H4V6zm6 0h4v4h-4V6zm6 0h4v4h-4V6zM4 14h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
            </svg>
          </button>
        </div>

          <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          <option value="">{t('sortDefault')}</option>
          <option value="price">{t('sortPriceLowHigh')}</option>
          <option value="-price">{t('sortPriceHighLow')}</option>
        </select>

        <input
          type="text"
          placeholder={t('searchProducts')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 min-w-[200px] text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* الشريط الجانبي */}
        <aside className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow p-5">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              التصفية
            </h3>
            <p className="text-sm text-gray-500 mb-2">الفئات</p>
            <div className="space-y-1">
              <button
                onClick={() => selectCategory('')}
                className={`w-full text-right px-3 py-2 rounded-lg text-sm transition ${
                  !selectedCategory ? 'bg-brand-primary text-white' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                الكل
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(String(cat.id))}
                  className={`w-full text-right px-3 py-2 rounded-lg text-sm transition ${
                    selectedCategory === String(cat.id) ? 'bg-brand-primary text-white' : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {cat.name_ar}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* المنتجات */}
        <div className="lg:col-span-3 order-1 lg:order-2">
            {loading ? (
            <p className="text-center text-gray-500 py-10">{t('loadingText')}</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 py-10">{t('noProductsFound')}</p>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}