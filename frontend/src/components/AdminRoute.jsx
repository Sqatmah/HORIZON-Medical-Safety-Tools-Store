import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ملاحظة: هاد فحص أولي بالفرونت بس للتجربة السريعة.
  // الحماية الحقيقية دايمًا بالباك إند (صلاحيات DRF يلي بنيناها).
  return children;
}