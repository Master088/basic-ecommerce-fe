import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
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
} from './cartSlice';
import cartAPI from './cartAPI';
import type { AddToCartPayload, UpdateQuantityPayload, CartItem } from './cartTypes';

function* handleFetchCart() {
  try {
    const cartItems: CartItem[] = yield call(cartAPI.fetchCart);
    yield put(fetchCartSuccess(cartItems));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(fetchCartFailure(error.message));
  }
}

function* handleAddToCart(action: PayloadAction<AddToCartPayload>) {
  try {
    const cartItems: CartItem[] = yield call(
      cartAPI.addToCart,
      action.payload.productId,
      action.payload.quantity
    );
    yield put(addToCartSuccess(cartItems));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(addToCartFailure(error.message));
  }
}

function* handleRemoveFromCart(action: PayloadAction<number>) {
  try {
    // Call API to remove item by id
    yield call(cartAPI.removeFromCart, action.payload);

    // Dispatch success action with the id of the removed item
    yield put(removeFromCartSuccess(action.payload));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(removeFromCartFailure(error.message));
  }
}


function* handleUpdateQuantity(action: PayloadAction<UpdateQuantityPayload>) {
  try {
    const cartItems: CartItem[] = yield call(
      cartAPI.updateQuantity,
      action.payload.productId,
      action.payload.quantity
    );
    yield put(updateQuantitySuccess(cartItems));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(updateQuantityFailure(error.message));
  }
}

export default function* cartSaga() {
  yield takeLatest(fetchCartRequest.type, handleFetchCart);
  yield takeLatest(addToCartRequest.type, handleAddToCart);
  yield takeLatest(removeFromCartRequest.type, handleRemoveFromCart);
  yield takeLatest(updateQuantityRequest.type, handleUpdateQuantity);
}
