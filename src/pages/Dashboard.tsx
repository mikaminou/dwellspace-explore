
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { MainNav } from "@/components/MainNav";
import { OwnerDashboard } from "@/components/owners/OwnerDashboard";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

export default function Dashboard() {
  const { session, isLoaded } = useAuth();
  const { profileData, isLoaded: isProfileLoaded } = useProfile();
  const navigate = useNavigate();

  // Get user role from profile data
  const userRole = profileData?.role || "buyer";
  const isSellerOrAgent = ["seller", "agent", "admin"].includes(userRole);

  useEffect(() => {
    console.log("Dashboard: Auth state", { session, isLoaded, profileData, isProfileLoaded, userRole, isSellerOrAgent });
    
    if (isLoaded && !session) {
      console.log("No session, redirecting to signin");
      navigate("/signin");
      return;
    }
    
    // Only check role after profile data is loaded
    if (isProfileLoaded && !isSellerOrAgent) {
      console.log("User is not seller/agent, showing buyer dashboard");
      toast.info("Welcome to your dashboard");
      // For now, we'll just not show the owner dashboard
      // Later we could create a BuyerDashboard component
    }
  }, [session, isLoaded, navigate, isProfileLoaded, isSellerOrAgent, userRole]);

  if (!isLoaded || !isProfileLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      {isSellerOrAgent ? (
        <OwnerDashboard />
      ) : (
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">Buyer Dashboard</h1>
          <p>Welcome to your dashboard. As a buyer, you can browse properties and save your favorites.</p>
          <div className="mt-8 grid gap-6">
            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
              <p className="text-muted-foreground">You haven't made any searches yet.</p>
            </div>
            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">Saved Properties</h2>
              <p className="text-muted-foreground">You haven't saved any properties yet.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
