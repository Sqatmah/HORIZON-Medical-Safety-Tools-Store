import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const ROLE_LABELS = { user: 'مستخدم', admin: 'أدمن', super_admin: 'أدمن إداري' };
const TYPE_LABELS = { individual: 'شخصي', company: 'شركة', government: 'جهة حكومية' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    apiClient.get('/users/')
      .then((res) => setUsers(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleRoleChange = async (id, role) => {
    await apiClient.patch(`/users/${id}/`, { role });
    loadData();
  };

  const handleTypeChange = async (id, customer_type) => {
    await apiClient.patch(`/users/${id}/`, { customer_type });
    loadData();
  };

  const handleToggleActive = async (id, current) => {
    await apiClient.patch(`/users/${id}/`, { is_active: !current });
    loadData();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">إدارة المستخدمين والصلاحيات</h1>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-right p-3">اسم المستخدم</th>
                <th className="text-right p-3">البريد الإلكتروني</th>
                <th className="text-right p-3">نوع العميل</th>
                <th className="text-right p-3">الصلاحية</th>
                <th className="text-right p-3">نشط؟</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3 font-medium">{u.username}</td>
                  <td className="p-3 text-gray-500">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.customer_type}
                      onChange={(e) => handleTypeChange(u.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      {Object.entries(TYPE_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      {Object.entries(ROLE_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={u.is_active}
                      onChange={() => handleToggleActive(u.id, u.is_active)}
                      className="w-4 h-4 accent-teal-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}