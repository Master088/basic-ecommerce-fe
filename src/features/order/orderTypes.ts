// src/features/order/orderTypes.ts

export interface OrderItem {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
  image:string;
   product: Product;
}
type Product = {
  image: string;
};
export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}


export interface PlaceOrder {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
   items: OrderItem[];
}
export interface CreateOrderPayload {
  userId: number;
  items: OrderItem[];
}

export interface UpdateOrderPayload {
  id: number;
  status: Order['status'];
}
