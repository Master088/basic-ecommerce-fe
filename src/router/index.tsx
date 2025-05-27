import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import HomePage from "../pages/HomePage";
 

import ProductPage from "../pages/ProductPage";
import ProductView from "../pages/ProductView";
import AddProductPage from "../pages/AddProductPage";
import EditProductPage from "../pages/EditProductPage";

import CartPage from "../pages/CartPage";

import OrderPage from "../pages/OrderPage.tsx";

import NotFoundPage from "../pages/NotFoundPage";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/products" element={<ProductPage />} />

        <Route path="/product/:id" element={<ProductView />} />

        <Route path="/cart" element={<CartPage />} />

        <Route path="/orders" element={<OrderPage />} />
        <Route path="/" element={<HomePage />} />

        {/* Protected Routes (Authenticated Users Only) */}
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/" element={<HomePage />} /> */}
          {/* Add other authenticated client routes here */}

          <Route path="/product/add" element={<AddProductPage />} />

          <Route path="/product/:id/edit" element={<EditProductPage />} />
        </Route>

        {/* Admin Routes (Authenticated Admins Only) */}
        <Route element={<AdminRoute />}>
    
          {/* Add other admin-only routes here */}
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
