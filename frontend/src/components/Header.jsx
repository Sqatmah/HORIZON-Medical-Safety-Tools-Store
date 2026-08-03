import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-teal-700">
          Horizon Care
        </Link>

        <nav className="flex gap-6 text-gray-700">
          <Link to="/" className="hover:text-teal-600">الرئيسية</Link>
          <Link to="/products" className="hover:text-teal-600">المنتجات</Link>
        </nav>

        <div className="flex gap-4 items-center">
          <Link to="/cart" className="hover:text-teal-600 relative">
            السلة
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-4 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              {user?.is_admin_role && (
                <Link to="/admin" className="text-teal-700 font-semibold hover:underline">
                  لوحة التحكم
                </Link>
              )}
              <Link to="/account" className="hover:text-teal-600">حسابي</Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm">
                خروج
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-teal-600">تسجيل الدخول</Link>
          )}
        </div>
      </div>
    </header>
  );
}