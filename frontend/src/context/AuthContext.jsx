import { createContext, useContext, useState } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!localStorage.getItem('access_token');

  // تسجيل الدخول (بعد وجود حساب مفعّل أصلًا)
  const login = async (username, password) => {
    const res = await apiClient.post('/auth/login/', { username, password });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);

    const meRes = await apiClient.get('/auth/me/');
    setUser(meRes.data);
    localStorage.setItem('user', JSON.stringify(meRes.data));
  };

  // إنشاء حساب جديد (يرجع رسالة، ما فيه توكن لسا لأنه لازم تحقق OTP أول)
  const register = async (data) => {
    const res = await apiClient.post('/auth/register/', data);
    return res.data;
  };

  // تحقق من رمز OTP (بعدها ترجع توكنات دخول جاهزة)
  const verifyOtp = async (email, otp_code) => {
    const res = await apiClient.post('/auth/verify-otp/', { email, otp_code });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);

    const meRes = await apiClient.get('/auth/me/');
    setUser(meRes.data);
    localStorage.setItem('user', JSON.stringify(meRes.data));
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}