import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import StoreLayout from './layouts/StoreLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminFooterSettings from './pages/admin/AdminFooterSettings';
import CategoryPage from './pages/Category';
import TrackOrder from './pages/TrackOrder';
import StaticPageView from './pages/StaticPage';
import Contact from './pages/Contact';
import AdminBanners from './pages/admin/AdminBanners';
import AdminCatalog from './pages/admin/AdminCatalog';
import { LanguageProvider } from './context/LanguageContext';





function App() {
  return (
    <LanguageProvider>
     <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<StoreLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/category" element={<CategoryPage />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/page/contact" element={<Contact />} />
              <Route path="/page/:slug" element={<StaticPageView />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
            
            </Route>

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="footer" element={<AdminFooterSettings />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="catalog" element={<AdminCatalog />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
    </LanguageProvider>
  );
}

export default App;