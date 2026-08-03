import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = بيانات التسجيل, 2 = رمز OTP
  const [formData, setFormData] = useState({ username: '', email: '', password: '', phone: '' });
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      setStep(2); // انتقل لخطوة إدخال رمز التحقق
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الحساب، تأكد من صحة البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(formData.email, otpCode);
      navigate('/account');
    } catch (err) {
      setError('رمز التحقق غير صحيح أو منتهي الصلاحية');
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-2 text-center">تحقق من بريدك الإلكتروني</h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          أرسلنا رمز تحقق إلى {formData.email}
        </p>

        <form onSubmit={handleVerify} className="bg-white shadow rounded-lg p-6 space-y-4">
          {error && <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded">{error}</p>}

          <input
            type="text"
            placeholder="رمز التحقق"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition disabled:bg-gray-300"
          >
            {loading ? 'جاري التحقق...' : 'تأكيد'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">إنشاء حساب جديد</h1>

      <form onSubmit={handleRegister} className="bg-white shadow rounded-lg p-6 space-y-4">
        {error && <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded">{error}</p>}

        <div>
          <label className="block text-sm text-gray-600 mb-1">اسم المستخدم</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">كلمة المرور</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">رقم الجوال (اختياري)</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition disabled:bg-gray-300"
        >
          {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
        </button>
      </form>
    </div>
  );
}