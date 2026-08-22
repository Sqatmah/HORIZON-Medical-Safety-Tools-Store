import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../api/entities';
import { useLanguage } from '../context/LanguageContext';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    Category.list()
      .then((data) => setCategories(data.filter((c) => c.is_active)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-primary mb-1">{language === 'ar' ? 'فئاتنا' : 'Our Categories'}</h1>
      <p className="text-gray-500 mb-8">{language === 'ar' ? 'تصفح فئاتنا الرئيسية للمنتجات' : 'Browse our main product categories'}</p>

      {loading ? (
        <p className="text-gray-500">جاري التحميل...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="category-card-glow relative rounded-2xl overflow-hidden h-96 block group"
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

              <div className="absolute bottom-0 right-0 p-7 text-white text-right w-full">
                                <h3 className="text-2xl font-bold mb-2">{language === 'ar' ? cat.name_ar : (cat.name_en || cat.name_ar)}</h3>
                {cat.description_ar && language === 'ar' && (
                  <p className="text-gray-200 text-sm mb-4">{cat.description_ar}</p>
                )}
                <span className="inline-flex items-center gap-1 text-brand-accent text-xs font-semibold">
                  {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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