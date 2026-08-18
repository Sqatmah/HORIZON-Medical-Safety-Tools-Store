import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../api/entities';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Category.list()
      .then((data) => setCategories(data.filter((c) => c.is_active)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#0B253D] mb-1">فئاتنا</h1>
      <p className="text-gray-500 mb-8">تصفح فئاتنا الرئيسية للمنتجات</p>

      {loading ? (
        <p className="text-gray-500">جاري التحميل...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="category-card relative rounded-2xl overflow-hidden h-80 block group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center category-card-image"
                style={{
                  backgroundImage: cat.image
                    ? `url(${cat.image})`
                    : 'linear-gradient(135deg, #0B253D, #1D8FA0)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B253D]/90 via-[#0B253D]/30 to-transparent" />

              <div className="absolute bottom-0 right-0 p-6 text-white text-right w-full">
                <div className="flex items-center gap-2 justify-end mb-2">
                  <h3 className="text-2xl font-bold">{cat.name_ar}</h3>
                  {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                </div>
                {cat.description_ar && (
                  <p className="text-gray-200 text-sm mb-3">{cat.description_ar}</p>
                )}
                <span className="inline-flex items-center gap-1 text-cyan-300 text-sm font-semibold">
                  تسوق الآن
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}