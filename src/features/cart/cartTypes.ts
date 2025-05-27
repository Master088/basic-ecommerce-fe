import type { Product } from "../product/productTypes";

export interface CartItem {
  id?:number,
  productId: number;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  image?: string;
  product?: Product;  // Optional full product details
}

export interface AddToCartPayload {
  productId: number;
  quantity: number;
}

export interface UpdateQuantityPayload {
  productId: number;
  quantity: number;
}
