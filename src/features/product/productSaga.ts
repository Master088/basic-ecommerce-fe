import { call, put, takeLatest } from 'redux-saga/effects';
import {
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
} from './productSlice';

import productAPI from './productAPI';
import type{ PayloadAction } from '@reduxjs/toolkit';
import type{ Product, ProductUpdatePayload, ProductQueryParams } from './productTypes';
import type { SagaIterator } from 'redux-saga';

// Fetch all products
// function* handleFetchProducts(): SagaIterator {
//   try {
//     const products: Product[] = yield call(productAPI.fetchAll);
//     yield put(fetchProductsSuccess(products));
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     yield put(fetchProductsFailure(error.message));
//   }
// }
function* handleFetchProducts(action: PayloadAction<ProductQueryParams>): SagaIterator {
  try {
    const params = action.payload;
    const products: Product[] = yield call(productAPI.fetchAll, params);
    yield put(fetchProductsSuccess(products));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(fetchProductsFailure(error.message));
  }
}
// Fetch product details
function* handleFetchProductDetail(action: PayloadAction<number>): SagaIterator {
  try {
    const product: Product = yield call(productAPI.fetchById, action.payload);
    yield put(fetchProductDetailSuccess(product));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(fetchProductDetailFailure(error.message));
  }
}

// Create product
function* handleCreateProduct(action: PayloadAction<FormData>): SagaIterator {
  try {
    const product: Product = yield call(productAPI.create, action.payload);
    yield put(createProductSuccess(product));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(createProductFailure(error.message || 'Something went wrong'));
  }
}
// Update product
function* handleUpdateProduct(action: PayloadAction<ProductUpdatePayload>): SagaIterator {
  try {
    const product: Product = yield call(productAPI.update, action.payload.id, action.payload.data);
    yield put(updateProductSuccess(product));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(updateProductFailure(error.message));
  }
}

// Delete product
function* handleDeleteProduct(action: PayloadAction<number>): SagaIterator {
  try {
    yield call(productAPI.remove, action.payload);
    yield put(deleteProductSuccess(action.payload));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(deleteProductFailure(error.message));
  }
}

// Root saga
export default function* productSaga(): SagaIterator {
  yield takeLatest(fetchProductsRequest.type, handleFetchProducts);
  yield takeLatest(fetchProductDetailRequest.type, handleFetchProductDetail);
  yield takeLatest(createProductRequest.type, handleCreateProduct);
  yield takeLatest(updateProductRequest.type, handleUpdateProduct);
  yield takeLatest(deleteProductRequest.type, handleDeleteProduct);
}
