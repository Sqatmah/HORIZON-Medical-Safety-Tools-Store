import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Product, Category } from '../api/entities';
import StarRating from '../components/StarRating';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState('');

  // جيب التصنيفات مرة وحدة بس عند فتح الصفحة
  useEffect(() => {
    Category.list().then(setCategories).catch(console.error);
  }, []);

  // جيب المنتجات كل ما تغيّر الفلتر أو البحث
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">جميع المنتجات</h1>

       {/* شريط البحث والفلترة */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSearchParams(e.target.value ? { category: e.target.value } : {});
          }}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">كل التصنيفات</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
          ))}
        </select>
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">الترتيب الافتراضي</option>
          <option value="price">السعر: من الأرخص للأغلى</option>
          <option value="-price">السعر: من الأغلى للأرخص</option>
        </select>
      </div>

      {/* عرض المنتجات */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">جاري التحميل...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-10">لا توجد منتجات مطابقة</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="product-card bg-white rounded-xl shadow p-4 block"
            >
              <div className="bg-gray-100 rounded-lg h-40 mb-3 flex items-center justify-center overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].image}
                    alt={product.name_ar}
                    className="product-card-image w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">لا توجد صورة</span>
                )}
              </div>
              <h2 className="font-semibold text-gray-800 truncate">{product.name_ar}</h2>
              {product.rating_avg > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <StarRating rating={product.rating_avg} size="text-xs" />
                  {product.quantity_sold > 0 && (
                    <span className="text-gray-400 text-xs">({product.quantity_sold})</span>
                  )}
                </div>
              )}
              <p className="text-teal-600 font-bold mt-2">{product.price} ريال</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}