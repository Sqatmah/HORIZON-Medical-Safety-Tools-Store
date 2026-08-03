import { useState, useEffect } from 'react';
import apiClient from '../../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0 });

  useEffect(() => {
    Promise.all([
      apiClient.get('/products/'),
      apiClient.get('/orders/'),
      apiClient.get('/categories/'),
    ]).then(([productsRes, ordersRes, categoriesRes]) => {
      const products = productsRes.data.results || productsRes.data;
      const orders = ordersRes.data.results || ordersRes.data;
      const categories = categoriesRes.data.results || categoriesRes.data;
      setStats({
        products: products.length,
        orders: orders.length,
        categories: categories.length,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm mb-1">إجمالي المنتجات</p>
          <p className="text-3xl font-bold text-teal-600">{stats.products}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm mb-1">إجمالي الطلبات</p>
          <p className="text-3xl font-bold text-teal-600">{stats.orders}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm mb-1">إجمالي التصنيفات</p>
          <p className="text-3xl font-bold text-teal-600">{stats.categories}</p>
        </div>
      </div>
    </div>
  );
}