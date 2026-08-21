import { Outlet } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useTrackVisit from '../hooks/useTrackVisit';

export default function StoreLayout() {
  useTrackVisit();
  const { language } = useLanguage();
  

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <TopBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}