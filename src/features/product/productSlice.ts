import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product, ProductQueryParams } from "./productTypes";

interface ProductState {
  list: Product[];
  loading: boolean;
  error: string | null;
  selected: Product | null;
  isSuccess: boolean | null;
}

const initialState: ProductState = {
  list: [],
  loading: false,
  error: null,
  selected: null,
  isSuccess: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Fetch all
// eslint-disable-next-line @typescript-eslint/no-unused-vars
      fetchProductsRequest(state, _action: PayloadAction<ProductQueryParams>) {
        state.loading = true;
        state.error = null;
      },
    fetchProductsSuccess(state, action: PayloadAction<Product[]>) {
      state.list = action.payload;
      state.loading = false;
    },
    fetchProductsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch detail

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchProductDetailRequest(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    fetchProductDetailSuccess(state, action: PayloadAction<Product>) {
      state.selected = action.payload;
      state.loading = false;
    },
    fetchProductDetailFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Create
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createProductRequest(state, _action: PayloadAction<FormData>) {
      state.loading = true;
      state.error = null;
    },
    createProductSuccess(state, action: PayloadAction<Product>) {
      state.list.push(action.payload);
      state.loading = false;
      state.isSuccess = true;
    },
    createProductFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetSuccessStatus(state) {
      state.isSuccess = false;
    },
    // Update
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateProductRequest(state,_action: PayloadAction<{ id: number; data: PayloadAction<FormData>}>
    ) {
      state.loading = true;
      state.error = null;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateProductSuccess(state,_action: PayloadAction<Product>) {
      state.isSuccess = true;
      state.loading = false;
    },
    updateProductFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteProductRequest(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    deleteProductSuccess(state, action: PayloadAction<number>) {
      state.list = state.list.filter((p) => p.id !== action.payload);
      state.loading = false;
    },
    deleteProductFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    clearProduct(state) {
      state.selected = null;
    },
  },
});

export const {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductDetailRequest,
  fetchProductDetailSuccess,
  fetchProductDetailFailure,
  createProductRequest,
  createProductSuccess,
  createProductFailure,
  updateProductRequest,
  updateProductSuccess,
  updateProductFailure,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFailure,
  clearProduct,
  resetSuccessStatus,
} = productSlice.actions;

export default productSlice.reducer;
