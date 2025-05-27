import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/product/productSlice';
import categoryReducer from '../features/category/categorySlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/order/orderSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  category: categoryReducer,
  cart: cartReducer,
  order: orderReducer,
});

export default rootReducer;
