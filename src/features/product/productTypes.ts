export interface Product {
  id: number;
  name: string;
  description?: string |"";
  price: number;
  discountedPrice?: number | 0;
  stock: number;
  image?: string;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ProductPayload = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export  interface ProductUpdatePayload {
  id: number;
  data: FormData; // changed from Partial<Product> to FormData
}

export type ProductQueryParams = {
  search?: string;
  categoryId?: number;
  categoryIds?: number[]; // Adjusted from categoryId to array of strings
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: 'price_asc' | 'price_desc';
};