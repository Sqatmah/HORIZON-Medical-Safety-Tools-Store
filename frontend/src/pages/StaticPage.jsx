import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/client';

export default function StaticPageView() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    apiClient.get('/pages/', { params: { slug } })
      .then((res) => {
        const results = res.data.results || res.data;
        const found = results.find((p) => p.slug === slug);
        if (found) setPage(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="text-center py-20 text-gray-500">جاري التحميل...</p>;
  if (notFound || !page) return <p className="text-center py-20 text-gray-500">الصفحة غير موجودة</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-right">
      <h1 className="text-3xl font-bold text-[#0B253D] mb-6">{page.title_ar}</h1>
      <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
        {page.content_ar}
      </div>
    </div>
  );
}
