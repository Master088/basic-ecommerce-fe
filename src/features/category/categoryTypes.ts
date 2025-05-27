// categoryTypes.ts

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
}

export interface CategoryUpdatePayload {
  id: number;
  data: Partial<CategoryPayload>;
}
