export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Horizon Care</h3>
          <p className="text-sm">معدات طبية وسلامة صناعية معتمدة من SFDA وSASO.</p>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg mb-3">روابط سريعة</h3>
          <ul className="space-y-2 text-sm">
            <li>من نحن</li>
            <li>سياسة الخصوصية</li>
            <li>الشروط والأحكام</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg mb-3">تواصل معنا</h3>
          <p className="text-sm">info@horizoncare.sa</p>
        </div>
      </div>
      <div className="text-center text-xs py-4 border-t border-gray-800">
        © 2026 Horizon Care. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}