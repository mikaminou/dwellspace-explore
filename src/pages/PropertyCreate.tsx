
import { useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { PropertyForm } from "@/components/owners/PropertyForm";
import { useAuth } from "@/contexts/auth";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PropertyCreate() {
  const { session, isLoaded } = useAuth();
  const { profileData, isLoaded: isProfileLoaded } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    
    if (isLoaded && !session) {
      toast.error("Please sign in to create a property listing");
      navigate("/signin");
      return;
    }
  }, [session, isLoaded, navigate, isProfileLoaded, profileData]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />
      <PropertyForm />
    </div>
  );
}
