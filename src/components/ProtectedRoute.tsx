
import { ReactNode, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-pulse text-primary font-semibold">Loading authentication...</div>
  </div>
);

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, isLoaded } = useAuth();

  // Add safeguards against the route rendering before auth is loaded
  if (!isLoaded) {
    return <LoadingFallback />;
  }

  // If no session is found after auth is loaded, redirect to signin
  if (!session) {
    console.log("No session found, redirecting to signin");
    return <Navigate to="/signin" replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
