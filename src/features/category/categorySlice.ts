import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Category, CategoryPayload, CategoryUpdatePayload } from './categoryTypes';

interface CategoryState {
  items: Category[];
  loading: boolean;
  error: string | null;
  selectedCategory: Category | null;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
  selectedCategory: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    fetchCategoriesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchCategoriesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchCategoryDetailRequest(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    fetchCategoryDetailSuccess(state, action: PayloadAction<Category>) {
      state.loading = false;
      state.selectedCategory = action.payload;
    },
    fetchCategoryDetailFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createCategoryRequest(state, _action: PayloadAction<CategoryPayload>) {
      state.loading = true;
    },
    createCategorySuccess(state, action: PayloadAction<Category>) {
      state.loading = false;
      state.items.push(action.payload);
    },
    createCategoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateCategoryRequest(state, _action: PayloadAction<CategoryUpdatePayload>) {
      state.loading = true;
    },
    updateCategorySuccess(state, action: PayloadAction<Category>) {
      state.loading = false;
      state.items = state.items.map(cat =>
        cat.id === action.payload.id ? action.payload : cat
      );
    },
    updateCategoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteCategoryRequest(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    deleteCategorySuccess(state, action: PayloadAction<number>) {
      state.loading = false;
      state.items = state.items.filter(cat => cat.id !== action.payload);
    },
    deleteCategoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchCategoryDetailRequest,
  fetchCategoryDetailSuccess,
  fetchCategoryDetailFailure,
  createCategoryRequest,
  createCategorySuccess,
  createCategoryFailure,
  updateCategoryRequest,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryFailure,
} = categorySlice.actions;

export default categorySlice.reducer;
