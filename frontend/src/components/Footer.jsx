import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0B253D] text-gray-300 mt-16">
      {/* النشرة الإخبارية */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-right">
            <h3 className="text-white font-bold">النشرة الإخبارية</h3>
            <p className="text-sm text-gray-400">اشترك لأحدث العروض والتحديثات</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm flex-1 md:w-64 focus:outline-none"
            />
            <button className="bg-teal-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-teal-600 whitespace-nowrap">
              اشترك
            </button>
          </div>
        </div>
      </div>

      {/* الأعمدة */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-right">
        <div>
          <div className="flex items-center gap-2 mb-4 justify-end">
            <span className="font-bold text-white">HORIZON CARE</span>
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-[#0B253D] text-xs font-bold">HC</div>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            هورايزون كير هو قسم متخصص تابع لشركة هورايزون للحلول التقنية والأمنية، مكرسة لتوريد
            المعدات الطبية ومعدات السلامة المعتمدة في جميع أنحاء المملكة العربية السعودية.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">روابط سريعة</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-teal-400">الرئيسية</Link></li>
            <li><Link to="/products" className="hover:text-teal-400">المنتجات</Link></li>
            <li><Link to="/page/about" className="hover:text-teal-400">من نحن</Link></li>
            <li><Link to="/page/contact" className="hover:text-teal-400">اتصل بنا</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">خدمة العملاء</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/track-order" className="hover:text-teal-400">تتبعي</Link></li>
            <li><Link to="/page/privacy" className="hover:text-teal-400">سياسة الخصوصية</Link></li>
            <li><Link to="/page/terms" className="hover:text-teal-400">الشروط والأحكام</Link></li>
            <li><Link to="/page/shipping-policy" className="hover:text-teal-400">سياسة الشحن والإرجاع</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">اتصل بنا</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 justify-end">
              <span>الرياض، المملكة العربية السعودية</span>
              <span>📍</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span dir="ltr">+966566586282</span>
              <span>📞</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>info@horizoncare.sa</span>
              <span>✉️</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>السبت-الخميس 8ص-10م</span>
              <span>🕒</span>
            </li>
          </ul>
        </div>
      </div>

      {/* شريط الحقوق */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>© 2026 Horizon Care. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-teal-400">Facebook</a>
            <a href="#" className="hover:text-teal-400">LinkedIn</a>
            <a href="#" className="hover:text-teal-400">Instagram</a>
            <a href="#" className="hover:text-teal-400">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}