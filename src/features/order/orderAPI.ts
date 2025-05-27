// src/features/order/orderAPI.ts
import axiosInstance from '@/api/axiosInstance';
import type { Order, CreateOrderPayload, UpdateOrderPayload } from './orderTypes';

const orderAPI = {
  fetchAll: async (): Promise<Order[]> => {
    const response = await axiosInstance.get('/order');
    return response.data;
  },

  fetchById: async (id: number): Promise<Order> => {
    const response = await axiosInstance.get(`/order/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderPayload): Promise<Order> => {
    const response = await axiosInstance.post('/order', data);
    return response.data;
  },

  update: async (id: number, data: Partial<UpdateOrderPayload>): Promise<Order> => {
    const response = await axiosInstance.put(`/order/${id}`, data);
    return response.data;
  },

    updateStatus: async (id: number, data: Partial<UpdateOrderPayload>): Promise<Order> => {
    const response = await axiosInstance.put(`/order/${id}/status/${data.status}`, data);
    return response.data.order;
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/order/${id}`);
  },
};

export default orderAPI;
