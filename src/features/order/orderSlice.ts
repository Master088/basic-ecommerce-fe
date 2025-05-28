// src/features/order/orderSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Order, Crea , UpdateOrderPayload, PlaceOrder } from './orderTypes';

interface OrderState {
  orders: Order[];
  orderDetail?: Order;
  status?:string;
  loading: boolean;
  error?: string;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  status:""
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    fetchOrdersRequest(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchOrdersSuccess(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
      state.loading = false;
    },
    fetchOrdersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchOrderDetailRequest(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = undefined;
    },
    fetchOrderDetailSuccess(state, action: PayloadAction<Order>) {
      state.orderDetail = action.payload;
      state.loading = false;
    },
    fetchOrderDetailFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createOrderRequest(state, _action: PayloadAction<PlaceOrder>) {
      state.loading = true;
      state.error = undefined;
    },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createOrderSuccess(state, _action: PayloadAction<Order>) {
      // state.orders.push(action.payload);
      state.status = "success"
      state.loading = false;
    },
    createOrderFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateOrderRequest(state, _action: PayloadAction<UpdateOrderPayload>) {
      // state.loading = true;
      state.error = undefined;
    },
updateOrderSuccess(state, action: PayloadAction<Order>) {

  const index = state.orders.findIndex(o => o.id === action.payload.id);
  if (index !== -1) {
    // Only update the status of the existing order
    state.orders[index].status = action.payload.status;
  }
  state.loading = false;
},
    updateOrderFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteOrderRequest(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = undefined;
    },
    deleteOrderSuccess(state, action: PayloadAction<number>) {
      state.orders = state.orders.filter(o => o.id !== action.payload);
      state.loading = false;
    },
    deleteOrderFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetOrderStatus(state) {
      state.status = "";
    },
    clearOrderError(state) {
      state.error = undefined;
    }
  },
});

export const {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchOrderDetailRequest,
  fetchOrderDetailSuccess,
  fetchOrderDetailFailure,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  updateOrderRequest,
  updateOrderSuccess,
  updateOrderFailure,
  deleteOrderRequest,
  deleteOrderSuccess,
  deleteOrderFailure,
  clearOrderError,
  resetOrderStatus,
} = orderSlice.actions;

export default orderSlice.reducer;
