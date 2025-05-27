// src/components/AdminRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

const AdminRoute: React.FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    // Optionally redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
