import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import logo from '../assets/logo.png';

const DEFAULT_FOOTER = {
  about_text: 'مؤسسة الابتكار التقني هي مؤسسة متخصصة في توريد المعدات الطبية ومعدات السلامة المعتمدة في جميع أنحاء المملكة العربية السعودية.',
  address: 'الرياض، المملكة العربية السعودية',
  phone: '+966566586282',
  email: 'info@techinnovation.sa',
  working_hours: 'السبت-الخميس 8ص-10م',
  facebook_url: '',
  linkedin_url: '',
  instagram_url: '',
  twitter_url: '',
  copyright_text: '© 2026 Tech Innovation. جميع الحقوق محفوظة.',
};

export default function Footer() {
  const [footer, setFooter] = useState(DEFAULT_FOOTER);

  useEffect(() => {
    apiClient.get('/footer-settings/')
      .then((res) => setFooter({ ...DEFAULT_FOOTER, ...res.data }))
      .catch(() => setFooter(DEFAULT_FOOTER));
  }, []);

  const socialLinks = [
    { label: 'Facebook', url: footer.facebook_url },
    { label: 'LinkedIn', url: footer.linkedin_url },
    { label: 'Instagram', url: footer.instagram_url },
    { label: 'Twitter', url: footer.twitter_url },
  ].filter((s) => s.url);

  return (
    <footer className="bg-brand-primary text-gray-300 mt-16">
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

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-right">
        <div>
          <div className="flex items-center gap-2 mb-4 justify-end">
            <img src={logo} alt="Tech Innovation" className="h-10 w-auto bg-white rounded-lg p-1" />
          </div>
          <p className="text-sm leading-relaxed text-gray-400">{footer.about_text}</p>
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
              <span>{footer.address}</span>
              <span>📍</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span dir="ltr">{footer.phone}</span>
              <span>📞</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>{footer.email}</span>
              <span>✉️</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>{footer.working_hours}</span>
              <span>🕒</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>{footer.copyright_text}</p>
          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="hover:text-teal-400">
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}