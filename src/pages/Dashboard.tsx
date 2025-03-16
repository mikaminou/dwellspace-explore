
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { MainNav } from "@/components/MainNav";
import { OwnerDashboard } from "@/components/owners/OwnerDashboard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { session, isLoaded } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !session) {
      navigate("/signin");
      return;
    }

    // Get the user role from the session
    if (session) {
      const role = session.user.user_metadata.role || "buyer";
      setUserRole(role);
      
      // Redirect buyers to a different page since they don't have owner dashboard access
      if (role === "buyer") {
        navigate("/profile");
      }
    }
  }, [session, isLoaded, navigate]);

  if (!isLoaded || !session) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  // Only show dashboard for agents and sellers
  if (userRole !== "agent" && userRole !== "seller") {
    return null; // This will be caught by the redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <OwnerDashboard />
    </div>
  );
}
