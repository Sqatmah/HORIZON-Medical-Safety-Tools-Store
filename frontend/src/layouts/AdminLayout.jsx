import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const baseMenuItems = [
  { path: '/admin', label: 'لوحة التحكم', exact: true },
  { path: '/admin/products', label: 'المنتجات' },
  { path: '/admin/categories', label: 'التصنيفات' },
  { path: '/admin/orders', label: 'الطلبات' },
  { path: '/admin/footer', label: 'إعدادات الفوتر' },
  { path: '/admin/banners', label: 'البانرات' },
  { path: '/admin/catalog', label: 'الكتالوج' },
  { path: '/admin/reports', label: 'التقارير' },
  { path: '/admin/correspondence', label: 'المراسلات' },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const menuItems = user?.is_super_admin_role
    ? [...baseMenuItems, { path: '/admin/users', label: 'المستخدمون والصلاحيات' }]
    : baseMenuItems;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-gray-300 flex-shrink-0">
        <div className="p-6 text-xl font-bold text-white border-b border-gray-800">
          Tech Innovation - إدارة
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive ? 'bg-teal-600 text-white' : 'hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800 mt-4">
          <Link to="/" className="text-sm text-gray-400 hover:text-white">
            ← الرجوع للمتجر
          </Link>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}