
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, isLoaded } = useAuth();

  // Show loading indicator while auth state is being determined
  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Redirect to signin if not authenticated
  if (!session) {
    return <Navigate to="/signin" replace />;
  }
  
  // If authenticated, render the protected content
  return <>{children}</>;
}
