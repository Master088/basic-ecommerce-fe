import axiosInstance from '@/api/axiosInstance';
import type { Product, ProductQueryParams } from './productTypes';

const productAPI = {
 fetchAll: async (params?: ProductQueryParams): Promise<Product[]> => {
  const response = await axiosInstance.get('/product', {
    params,
  });
  return response.data;
},

  fetchById: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get(`/product/${id}`);
    return response.data;
  },

  // Changed from Partial<Product> to FormData
  create: async (formData: FormData): Promise<Product> => {
    const response = await axiosInstance.post('/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Changed from Partial<Product> to FormData
  update: async (id: number, formData: FormData): Promise<Product> => {
    const response = await axiosInstance.put(`/product/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/product/${id}`);
  },
};

export default productAPI;
