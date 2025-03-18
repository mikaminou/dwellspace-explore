
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
    if (isLoaded && !session) {
      navigate("/signin");
      return;
    }
  }, [session, isLoaded, navigate, isProfileLoaded, isSellerOrAgent]);

  if (!isLoaded || !isProfileLoaded) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  // Only show dashboard for agents and sellers
  if (!isSellerOrAgent) {
    return null; // This will be caught by the redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <OwnerDashboard />
    </div>
  );
}
