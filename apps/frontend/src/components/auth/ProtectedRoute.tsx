import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  redirectPath = '/admin/login'
}) => {
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const location = useLocation();

  // Deterministic v2 Hydration Guard
  // Prevents "Success -> Blank Page" or "Success -> Login" race conditions
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF7A2F]" />
        <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">Syncing Secure Session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && !user.isSuperAdmin && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
