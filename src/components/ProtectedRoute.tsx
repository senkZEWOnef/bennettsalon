import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../contexts/AdminContextNew'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAdmin()

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />
}

export default ProtectedRoute