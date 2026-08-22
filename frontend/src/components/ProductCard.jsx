import { Link } from 'react-router-dom';
import { useState } from 'react';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/translations';

export default function ProductCard({ product }) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(100 - (Number(product.discount_price) / Number(product.price)) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card bg-white rounded-xl shadow p-4 block relative">
      {/* البادجات */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-1 items-end">
        {hasDiscount && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">-{discountPercent}%</span>
        )}
        {product.is_best_seller && (
          <span className="bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">★ {t('bestSeller')}</span>
        )}
        {product.is_new_arrival && (
          <span className="bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded-md">{t('newBadge')}</span>
        )}
      </div>

            <div className="bg-gray-100 rounded-lg h-40 mb-3 flex items-center justify-center overflow-hidden">
        {product.images?.length > 0 ? (
          <img src={product.images[0].image} alt={product.name_ar} className="product-card-image w-full h-full object-contain p-2" />
        ) : (
          <span className="text-gray-400 text-sm">لا توجد صورة</span>
        )}
      </div>

        <h2 className="font-semibold text-gray-800 truncate">{language === 'ar' ? product.name_ar : (product.name_en || product.name_ar)}</h2>

      {product.rating_avg > 0 && (
        <div className="flex items-center gap-1 mt-1">
          <StarRating rating={product.rating_avg} size="text-xs" />
          <span className="text-gray-400 text-xs">({product.rating_count || 0})</span>
        </div>
      )}
      {product.quantity_sold > 0 && (
        <p className="text-gray-400 text-xs mt-0.5">{t('soldCount')} {product.quantity_sold}</p>
      )}

      <div className="flex items-center gap-2 mt-2">
        {hasDiscount ? (
          <>
            <span className="text-teal-600 font-bold">{product.discount_price} {t('riyal')}</span>
            <span className="text-gray-400 text-sm line-through">{product.price} {t('riyal')}</span>
          </>
        ) : (
          <span className="text-teal-600 font-bold">{product.price} {t('riyal')}</span>
        )}
      </div>

      <button
        onClick={handleQuickAdd}
        disabled={product.stock === 0}
        className="w-full mt-3 bg-brand-primary text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-40"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
                {added ? `✓ ${t('addedToCart')}` : product.stock === 0 ? t('outOfStock') : t('addToCart')}
      </button>
    </Link>
  );
}