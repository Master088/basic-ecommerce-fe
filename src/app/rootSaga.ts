import { all } from 'redux-saga/effects';
import authSaga from '../features/auth/authSaga';
import productSaga from '../features/product/productSaga';
import categorySaga from '../features/category/categorySaga';
import cartSaga from '../features/cart/cartSaga';
import orderSaga from '../features/order/orderSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    productSaga(),
    categorySaga(),
    cartSaga(),
    orderSaga(),
  ]);
}
