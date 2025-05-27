import { call, put, takeLatest, type CallEffect, type PutEffect } from 'redux-saga/effects';
import categoryAPI from './categoryAPI';
import {
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  createCategoryRequest,
  createCategorySuccess,
  createCategoryFailure,
  updateCategoryRequest,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryFailure,
} from './categorySlice';
import type{ Category} from './categoryTypes';

type SagaReturnType<Y = unknown> = Generator<CallEffect<Y> | PutEffect, void, Y>;

function* handleFetchCategories(): SagaReturnType<Category[]> {
  try {
    const categories = yield call(categoryAPI.fetchAll);
    yield put(fetchCategoriesSuccess(categories));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(fetchCategoriesFailure(error.message));
  }
}

function* handleCreateCategory(
  action: ReturnType<typeof createCategoryRequest>
): SagaReturnType<Category> {
  try {
    const category = yield call(categoryAPI.create, action.payload);
    yield put(createCategorySuccess(category));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(createCategoryFailure(error.message));
  }
}

function* handleUpdateCategory(
  action: ReturnType<typeof updateCategoryRequest>
): SagaReturnType<Category> {
  try {
    const category = yield call(categoryAPI.update, action.payload.id, action.payload.data);
    yield put(updateCategorySuccess(category));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(updateCategoryFailure(error.message));
  }
}

function* handleDeleteCategory(
  action: ReturnType<typeof deleteCategoryRequest>
): SagaReturnType<void> {
  try {
    yield call(categoryAPI.remove, action.payload);
    yield put(deleteCategorySuccess(action.payload));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(deleteCategoryFailure(error.message));
  }
}

export default function* categorySaga() {
  yield takeLatest(fetchCategoriesRequest.type, handleFetchCategories);
  yield takeLatest(createCategoryRequest.type, handleCreateCategory);
  yield takeLatest(updateCategoryRequest.type, handleUpdateCategory);
  yield takeLatest(deleteCategoryRequest.type, handleDeleteCategory);
}
