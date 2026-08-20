import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // أغلق القائمة عند الضغط بره المكوّن
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // بحث مؤجل (debounce) — ينتظر 400ms بعد ما المستخدم يوقف عن الكتابة
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      apiClient.get('/products/', { params: { search: query } })
        .then((res) => {
          const data = res.data.results || res.data;
          setResults(data.slice(0, 6)); // أول 6 نتائج بس
          setShowResults(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowResults(false);
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder="ابحث عن المنتجات..."
          className="w-full border rounded-full px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
        />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-accent transition-all hover:drop-shadow-[0_0_6px_rgba(0,168,204,0.8)]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </button>
      </form>

      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border overflow-hidden z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-sm text-gray-400 text-center">جاري البحث...</p>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-gray-400 text-center">لا توجد نتائج مطابقة</p>
          ) : (
            <>
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition border-b last:border-b-0"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {product.images?.length > 0 ? (
                      <img src={product.images[0].image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="font-medium text-gray-800 text-sm truncate">{product.name_ar}</p>
                    <p className="text-brand-accent text-sm font-bold">{product.price} ريال</p>
                  </div>
                </Link>
              ))}
              <button
                onClick={handleSubmit}
                className="w-full text-center py-2.5 text-sm text-brand-primary font-semibold hover:bg-gray-50 border-t"
              >
                عرض كل النتائج ←
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}