
import { ReactNode } from "react";
import { useAuth } from "@/contexts/auth";

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isLoaded } = useAuth();

  // Show loading indicator only while auth state is being determined
  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Public route - always render children regardless of auth status
  return <>{children}</>;
}
