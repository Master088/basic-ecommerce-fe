// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer.ts';
import rootSaga from './rootSaga.ts';

// Create saga middleware
export const sagaMiddleware = createSagaMiddleware();

// Configure the store with root reducer and saga middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disable thunk, we use saga
      serializableCheck: false, // (optional) to avoid warnings if needed
    }).concat(sagaMiddleware),
});

// Run the root saga
sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
