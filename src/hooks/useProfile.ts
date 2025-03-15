
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/language/LanguageContext";

// Define the schema
const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(["buyer", "seller", "agent", "admin"]),
  agency: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function useProfile() {
  const { session, isLoaded } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormValues | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      bio: "",
      role: "buyer",
      agency: "",
    },
  });

  useEffect(() => {
    if (!isLoaded) return;

    if (!session) {
      navigate("/signin");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (data) {
          form.reset({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone_number: data.phone_number || "",
            bio: data.bio || "",
            role: data.role,
            agency: data.agency || "",
          });
          setProfileData(data as ProfileFormValues);
        }
      } catch (error: any) {
        toast({
          title: t('profile.errorLoading') || "Error loading profile",
          description: error.message || t('profile.errorLoadingDescription') || "Could not load your profile information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, isLoaded, navigate, toast, form, t]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          bio: values.bio,
          role: values.role,
          agency: values.agency,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session?.user.id);

      if (error) throw error;

      toast({
        title: t('profile.updated') || "Profile updated",
        description: t('profile.updatedDescription') || "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: t('profile.errorUpdating') || "Error updating profile",
        description: error.message || t('profile.errorUpdatingDescription') || "Could not update your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get user information
  const userEmail = session?.user?.email;
  const userAvatar = session?.user?.user_metadata?.avatar_url;
  const userName = profileData?.first_name || session?.user?.user_metadata?.first_name || "";
  const userAgency = profileData?.agency || session?.user?.user_metadata?.agency || "";
  const userInitials = userName 
    ? userName.slice(0, 2).toUpperCase() 
    : userEmail 
      ? userEmail.slice(0, 2).toUpperCase() 
      : "U";

  return {
    form,
    loading,
    profileData,
    onSubmit,
    userInfo: {
      userEmail,
      userAvatar,
      userName,
      userInitials,
      userRole: profileData?.role,
      userAgency,
    },
    isLoaded
  };
}
