import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const emptyForm = {
  name_en: '', name_ar: '', slug: '',
  short_desc_en: '', short_desc_ar: '', desc_en: '', desc_ar: '',
  price: '', discount_price: '', sku: '', stock: 0, low_stock_threshold: 5,
  category: '', brand: '', video_url: '', status: 'draft',
  sfda_number: '', country_of_origin: '', warranty_en: '', warranty_ar: '',
  compliance_standard: '', tags: '',
};

const emptySpec = { key_en: '', key_ar: '', value_en: '', value_ar: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [specs, setSpecs] = useState([]);
  const [error, setError] = useState('');

  const [productImages, setProductImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([apiClient.get('/products/'), apiClient.get('/categories/')])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data.results || prodRes.data);
        setCategories(catRes.data.results || catRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewForm = () => {
    setForm(emptyForm);
    setSpecs([]);
    setProductImages([]);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setForm({
      name_en: product.name_en, name_ar: product.name_ar, slug: product.slug,
      short_desc_en: product.short_desc_en || '', short_desc_ar: product.short_desc_ar || '',
      desc_en: product.desc_en || '', desc_ar: product.desc_ar || '',
      price: product.price, discount_price: product.discount_price || '',
      sku: product.sku || '', stock: product.stock, low_stock_threshold: product.low_stock_threshold,
      category: product.category, brand: product.brand || '', video_url: product.video_url || '',
      status: product.status,
      sfda_number: product.sfda_number || '', country_of_origin: product.country_of_origin || '',
      warranty_en: product.warranty_en || '', warranty_ar: product.warranty_ar || '',
      compliance_standard: product.compliance_standard || '',
      tags: (product.tags || []).join(', '),
    });
    setSpecs(product.specs && product.specs.length > 0 ? product.specs : []);
    setProductImages(product.images || []);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleNameChange = (value) => {
    const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm({ ...form, name_en: value, slug });
  };

  const addSpec = () => setSpecs([...specs, { ...emptySpec }]);
  const updateSpec = (index, field, value) => {
    const updated = [...specs];
    updated[index] = { ...updated[index], [field]: value };
    setSpecs(updated);
  };
  const removeSpec = (index) => setSpecs(specs.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...form,
      discount_price: form.discount_price || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      specs: specs.filter((s) => s.key_en || s.key_ar),
    };

    try {
      if (editingId) {
        await apiClient.patch(`/products/${editingId}/`, payload);
        setShowForm(false);
      } else {
        const res = await apiClient.post('/products/', payload);
        setEditingId(res.data.id);
        setProductImages([]);
      }
      loadData();
    } catch (err) {
      const details = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err.message;
      setError('حدث خطأ: ' + details);
      console.error('تفاصيل خطأ الحفظ:', details);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('متأكد من حذف هذا المنتج؟')) return;
    await apiClient.delete(`/products/${id}/`);
    loadData();
  };

  const handleStatusChange = async (id, newStatus) => {
    await apiClient.patch(`/products/${id}/`, { status: newStatus });
    loadData();
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0 || !editingId) return;

    setUploadingImage(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    try {
      const res = await apiClient.post(`/products/${editingId}/upload_image/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('نتيجة رفع الصور:', res.data);
      setProductImages((prev) => [...prev, ...res.data]);
    } catch (err) {
      console.error('خطأ رفع الصور:', err.response?.data || err.message);
      alert('فشل رفع الصور: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!confirm('حذف هذه الصورة؟')) return;
    await apiClient.delete(`/products/${editingId}/images/${imageId}/`);
    setProductImages(productImages.filter((img) => img.id !== imageId));
    loadData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
        <button onClick={openNewForm} className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700">
          + إضافة منتج
        </button>
      </div>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-right p-3">الصورة</th>
                <th className="text-right p-3">الاسم</th>
                <th className="text-right p-3">SKU</th>
                <th className="text-right p-3">السعر</th>
                <th className="text-right p-3">المخزون</th>
                <th className="text-right p-3">الحالة</th>
                <th className="text-right p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">{product.name_ar}</td>
                  <td className="p-3 text-gray-500">{product.sku || '—'}</td>
                  <td className="p-3">{product.price} ريال</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">
                    <select
                      value={product.status}
                      onChange={(e) => handleStatusChange(product.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="published">منشور</option>
                      <option value="draft">مسودة</option>
                      <option value="hidden">مخفي</option>
                    </select>
                  </td>
                  <td className="p-3 space-x-2 space-x-reverse">
                    <button onClick={() => openEditForm(product)} className="text-teal-600 hover:underline">تعديل</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:underline">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'تعديل منتج' : 'إضافة منتج جديد'}
            </h2>

            {error && <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-700">المعلومات الأساسية</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">الاسم (إنجليزي)</label>
                    <input type="text" value={form.name_en} onChange={(e) => handleNameChange(e.target.value)} required className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">الاسم (عربي)</label>
                    <input type="text" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">الرابط (slug)</label>
                    <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">SKU / كود المنتج</label>
                    <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="مثال: MED-001" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">التصنيف</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full border rounded-lg px-3 py-2">
                      <option value="">اختر تصنيف</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">العلامة التجارية</label>
                    <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">الحالة</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                      <option value="draft">مسودة</option>
                      <option value="published">منشور</option>
                      <option value="hidden">مخفي</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-700">السعر والمخزون</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">السعر (ريال)</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">سعر الخصم (اختياري)</label>
                    <input type="number" step="0.01" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">الكمية بالمخزون</label>
                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">حد التنبيه للمخزون المنخفض</label>
                    <input type="number" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-700">الوصف</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="وصف قصير (إنجليزي)" value={form.short_desc_en} onChange={(e) => setForm({ ...form, short_desc_en: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  <input type="text" placeholder="وصف قصير (عربي)" value={form.short_desc_ar} onChange={(e) => setForm({ ...form, short_desc_ar: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  <textarea placeholder="الوصف الكامل (إنجليزي)" value={form.desc_en} onChange={(e) => setForm({ ...form, desc_en: e.target.value })} rows={2} className="w-full border rounded-lg px-3 py-2" />
                  <textarea placeholder="الوصف الكامل (عربي)" value={form.desc_ar} onChange={(e) => setForm({ ...form, desc_ar: e.target.value })} rows={2} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-700">الامتثال والضمان</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="رقم SFDA" value={form.sfda_number} onChange={(e) => setForm({ ...form, sfda_number: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  <input type="text" placeholder="بلد المنشأ" value={form.country_of_origin} onChange={(e) => setForm({ ...form, country_of_origin: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  <input type="text" placeholder="معايير الجودة (SFDA, CE...)" value={form.compliance_standard} onChange={(e) => setForm({ ...form, compliance_standard: e.target.value })} className="w-full border rounded-lg px-3 py-2 col-span-2" />
                  <input type="text" placeholder="الضمان (إنجليزي)" value={form.warranty_en} onChange={(e) => setForm({ ...form, warranty_en: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  <input type="text" placeholder="الضمان (عربي)" value={form.warranty_ar} onChange={(e) => setForm({ ...form, warranty_ar: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-700">الوسوم (Tags)</h3>
                <input type="text" placeholder="افصل بينهم بفاصلة: medical, safety, ppe" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-700">المواصفات التفصيلية</h3>
                  <button type="button" onClick={addSpec} className="text-teal-600 text-sm hover:underline">+ إضافة مواصفة</button>
                </div>
                {specs.map((spec, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 mb-2 items-center">
                    <input type="text" placeholder="الخاصية EN" value={spec.key_en} onChange={(e) => updateSpec(i, 'key_en', e.target.value)} className="border rounded-lg px-2 py-1 text-sm" />
                    <input type="text" placeholder="الخاصية AR" value={spec.key_ar} onChange={(e) => updateSpec(i, 'key_ar', e.target.value)} className="border rounded-lg px-2 py-1 text-sm" />
                    <input type="text" placeholder="القيمة EN" value={spec.value_en} onChange={(e) => updateSpec(i, 'value_en', e.target.value)} className="border rounded-lg px-2 py-1 text-sm" />
                    <input type="text" placeholder="القيمة AR" value={spec.value_ar} onChange={(e) => updateSpec(i, 'value_ar', e.target.value)} className="border rounded-lg px-2 py-1 text-sm" />
                    <button type="button" onClick={() => removeSpec(i)} className="text-red-500 text-sm">حذف</button>
                  </div>
                ))}
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-700">صور المنتج</h3>

                {!editingId ? (
                  <p className="text-sm text-gray-400">
                    احفظ المنتج أولًا (اضغط "حفظ" بالأسفل)، وبعدها راح يظهر لك خيار رفع الصور مباشرة.
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {productImages.map((img) => (
                        <div key={img.id} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                          <img src={img.image} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleImageDelete(img.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
                      {uploadingImage ? 'جاري الرفع...' : '+ رفع صورة أو أكثر'}
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
                    </label>
                  </>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">
                  {editingId ? 'حفظ التعديلات' : 'حفظ المنتج'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
                  إغلاق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}