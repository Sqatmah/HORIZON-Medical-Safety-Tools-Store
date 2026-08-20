import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import SearchBar from './SearchBar';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/translations';

export default function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslation(language);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
                <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="Tech Innovation" className="h-10 w-auto" />
        </Link>

        <nav className="hidden lg:flex gap-6 text-gray-700 text-sm whitespace-nowrap">
          <Link to="/" className="hover:text-teal-600">{t('home')}</Link>
          <Link to="/products" className="hover:text-teal-600">{t('products')}</Link>
          <Link to="/category" className="hover:text-teal-600">{t('categories')}</Link>
          <Link to="/track-order" className="hover:text-teal-600">{t('trackOrder')}</Link>
          <Link to="/page/about" className="hover:text-teal-600">{t('aboutUs')}</Link>
          <Link to="/page/contact" className="hover:text-teal-600">{t('contactUs')}</Link>
        </nav>

        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>

        <div className="flex gap-4 items-center flex-shrink-0">
          <Link to="/wishlist" className="text-gray-600 hover:text-teal-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>

                    {isAuthenticated ? (
            <div className="relative group pb-2 -mb-2">
              <button className="text-gray-600 hover:text-teal-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <div className="absolute left-0 top-full w-40 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block text-sm">
                                {user?.is_admin_role && (
                  <Link to="/admin" className="block px-4 py-2 text-teal-700 font-semibold hover:bg-gray-50">{t('adminDashboard')}</Link>
                )}
                <Link to="/account" className="block px-4 py-2 hover:bg-gray-50">{t('myAccount')}</Link>
                <button onClick={handleLogout} className="block w-full text-right px-4 py-2 text-red-500 hover:bg-gray-50">{t('logout')}</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-teal-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}

          <Link to="/cart" className="relative text-gray-600 hover:text-teal-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}