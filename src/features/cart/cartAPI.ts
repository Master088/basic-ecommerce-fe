import axiosInstance from '@/api/axiosInstance';
import type { CartItem,  } from './cartTypes';

const cartAPI = {
  fetchCart: async (): Promise<CartItem[]> => {
    const response = await axiosInstance.get('/cart');
    return response.data;
  },

  addToCart: async (productId: number, quantity: number): Promise<CartItem[]> => {
    const response = await axiosInstance.post('/cart', { productId, quantity });
    return response.data;
  },

  removeFromCart: async (productId: number): Promise<CartItem[]> => {
    const response = await axiosInstance.delete(`/cart/${productId}`);
    return response.data;
  },

  updateQuantity: async (productId: number, quantity: number): Promise<CartItem[]> => {
    const response = await axiosInstance.put(`/cart/${productId}`, { quantity });
    return response.data;
  },
};

export default cartAPI;
