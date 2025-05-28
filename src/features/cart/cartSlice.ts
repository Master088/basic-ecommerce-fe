import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, AddToCartPayload, UpdateQuantityPayload } from './cartTypes';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    fetchCartRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCartSuccess(state, action: PayloadAction<CartItem[]>) {

      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchCartFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addToCartRequest(state, _action: PayloadAction<AddToCartPayload>) {
      state.loading = true;
      state.error = null;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addToCartSuccess(state, _action: PayloadAction<CartItem[]>) {
      // state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addToCartFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeFromCartRequest(state, _action: PayloadAction<number>) {
      state.error = null;
    },
     removeFromCartSuccess(state, action: PayloadAction<number>) {

    const idToRemove = action.payload;
    // Filter out the removed item from the cart items
    state.items = state.items.filter(item => item.id !== idToRemove);
    state.loading = false;
  },
    
    removeFromCartFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateQuantityRequest(state, _action: PayloadAction<UpdateQuantityPayload>) {
      state.error = null;
    },
    updateQuantitySuccess(state, action: PayloadAction<UpdateQuantityPayload>) {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
      state.loading = false;
      state.error = null;
    },
    updateQuantityFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCartRequest,
  fetchCartSuccess,
  fetchCartFailure,
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  removeFromCartRequest,
  removeFromCartSuccess,
  removeFromCartFailure,
  updateQuantityRequest,
  updateQuantitySuccess,
  updateQuantityFailure,
} = cartSlice.actions;

export default cartSlice.reducer;
