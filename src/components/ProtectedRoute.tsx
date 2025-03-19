
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  isPublic?: boolean;
}

export function ProtectedRoute({ children, isPublic = false }: ProtectedRouteProps) {
  const { session, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If the route is public, allow access to everyone
  if (isPublic || session) {
    return <>{children}</>;
  }
}
