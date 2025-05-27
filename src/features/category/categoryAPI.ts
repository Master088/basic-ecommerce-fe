import axiosInstance from '@/api/axiosInstance';
import type{ Category, CategoryPayload } from './categoryTypes';

const categoryAPI = {
  fetchAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  fetchById: async (id: number): Promise<Category> => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  create: async (payload: CategoryPayload): Promise<Category> => {
    const response = await axiosInstance.post('/categories', payload);
    return response.data;
  },

  update: async (id: number, payload: Partial<CategoryPayload>): Promise<Category> => {
    const response = await axiosInstance.put(`/categories/${id}`, payload);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },
};

export default categoryAPI;
