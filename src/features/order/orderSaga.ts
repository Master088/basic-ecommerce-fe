// src/features/order/orderSaga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import orderAPI from './orderAPI';
import {
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
} from './orderSlice';
import type { UpdateOrderPayload, Order, PlaceOrder } from './orderTypes';
import { removeFromCartRequest } from '../cart/cartSlice';

function* handleFetchOrders() {
  try {
    const orders: Order[] = yield call(orderAPI.fetchAll);
    yield put(fetchOrdersSuccess(orders));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(fetchOrdersFailure(error.message));
  }
}

function* handleFetchOrderDetail(action: PayloadAction<number>) {
  try {
    const order: Order = yield call(orderAPI.fetchById, action.payload);
    yield put(fetchOrderDetailSuccess(order));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(fetchOrderDetailFailure(error.message));
  }
}

function* handleCreateOrder(action: PayloadAction<PlaceOrder>) {
  try {
    const order: Order = yield call(orderAPI.create, action.payload);
    yield put(createOrderSuccess(order));

      // Extract product IDs from ordered items
    const cartIds = action.payload.items.map(item => item.id);

    // Remove items one by one
    for (const cartId of cartIds) {
      yield put(removeFromCartRequest(cartId??0));
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(createOrderFailure(error.message));
  }
}

function* handleUpdateOrder(action: PayloadAction<UpdateOrderPayload>) {
  try {
    const order: Order = yield call(orderAPI.updateStatus, action.payload.id, { status: action.payload.status });
    yield put(updateOrderSuccess(order));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(updateOrderFailure(error.message));
  }
}

function* handleDeleteOrder(action: PayloadAction<number>) {
  try {
    yield call(orderAPI.remove, action.payload);
    yield put(deleteOrderSuccess(action.payload));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(deleteOrderFailure(error.message));
  }
}

export default function* orderSaga() {
  yield takeLatest(fetchOrdersRequest.type, handleFetchOrders);
  yield takeLatest(fetchOrderDetailRequest.type, handleFetchOrderDetail);
  yield takeLatest(createOrderRequest.type, handleCreateOrder);
  yield takeLatest(updateOrderRequest.type, handleUpdateOrder);
  yield takeLatest(deleteOrderRequest.type, handleDeleteOrder);
}
