import apiClient from './client';

const makeEntity = (resource) => ({
  list: async (params = {}) => {
    const res = await apiClient.get(`/${resource}/`, { params });
    return res.data.results || res.data;
  },
  get: async (id) => {
    const res = await apiClient.get(`/${resource}/${id}/`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post(`/${resource}/`, data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.patch(`/${resource}/${id}/`, data);
    return res.data;
  },
  delete: async (id) => {
    await apiClient.delete(`/${resource}/${id}/`);
  },
});

export const Product = makeEntity('products');
export const Category = makeEntity('categories');
export const Order = makeEntity('orders');
export const Review = makeEntity('reviews');
export const Wishlist = makeEntity('wishlist');
export const Address = makeEntity('addresses');
export const Coupon = makeEntity('coupons');