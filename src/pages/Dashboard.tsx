
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


  useEffect(() => {
    if (isLoaded && !session) {
      navigate("/signin");
      return;
    }
  }, [session, isLoaded, navigate, isProfileLoaded]);

  if (!isLoaded || !isProfileLoaded) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <OwnerDashboard />
    </div>
  );
}
