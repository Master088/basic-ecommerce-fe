// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

const ProtectedRoute: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
