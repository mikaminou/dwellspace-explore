
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Allow access to the index page without authentication
  if (location.pathname === "/") {
    return <>{children}</>;
  }

  return session ? <>{children}</> : <Navigate to="/auth" replace />;
}
