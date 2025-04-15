import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

// Define valid role types - using string literals for now since the enum might not exist yet
type UserRole = Database["public"]["Enums"]["user_role"];
const validRoles: UserRole[] = ["individual", "agent", "admin"];

// Function to validate roles
const validateRole = (role: string): UserRole => {
  if (validRoles.includes(role as UserRole)) {
    return role as UserRole;
  }
  return "individual"; // Default to buyer if invalid role
};

export const authService = {
  signUp: async (email: string, password: string, displayName: string) => {
    try {      
      // Prepare user metadata without role
      const userMetadata: Record<string, any> = {
        first_name: displayName.split(' ')[0],
        last_name: displayName.split(' ').slice(1).join(' '),
      };
            
      // Sign up and auto-confirm email (for development)
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: `${window.location.origin}/profile-completion`
        }
      });
      
      if (error) {
        console.error("Supabase signup error:", error);
        throw error;
      }
      
      
      // Check if user was created successfully
      if (data.user) {
        toast.success("Account created successfully. Please complete your profile.");
        return { user: data.user, session: data.session };
      } else {
        toast.error("Something went wrong during signup. Please try again.");
        return { user: null, session: null };
      }
    } catch (error: any) {      
      // Provide more specific error messages for common issues
      if (error.message && error.message.includes("Database error saving new user")) {
        toast.error("There was an issue with your information. Please try again.");
      } else if (error.message && error.message.includes("duplicate key value")) {
        toast.error("An account with this email already exists. Please sign in instead.");
      } else {
        toast.error(`Sign up failed: ${error.message}`);
      }
      throw error;
    }
  },

  createProfile: async (userId: string, profileData: {
    first_name: string;
    last_name: string;
    role: string;
    phone_number?: string;
  }) => {
    try {
      console.log("Creating profile for user:", userId);
      console.log("With data:", profileData);
      
      // Validate role before saving to database
      const validatedRole = validateRole(profileData.role);
      
      // Check if profile already exists, but use maybeSingle() instead of single()
      // This won't throw an error if no profile is found
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileCheckError) {
        throw profileCheckError;
      }
      
      if (existingProfile) {
        console.log("Profile already exists, updating data");
        // Update the existing profile with the provided data
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            ...profileData,
            role: validatedRole,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        if (updateError) throw updateError;
      } else {
        console.log("Creating new profile");
        // Insert a new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            ...profileData,
            role: validatedRole,
          });
          
        if (insertError) throw insertError;
      }
      
      toast.success("Profile created successfully!");
      return true;
      
    } catch (error: any) {
      console.error("Error creating/updating profile:", error);
      toast.error(`Failed to create profile: ${error.message}`);
      throw error;
    }
  },

  sendEmailConfirmation: async (email: string, role: string) => {
    try {
      // In development mode, we're skipping actual email confirmation
      // Just redirecting to profile completion
      console.log("Development mode: Skipping email confirmation for", email);
      console.log("Role selected:", role);
      
      // Return success
      return true;
    } catch (error: any) {
      console.error("Error sending email confirmation:", error);
      toast.error(`Failed to send confirmation: ${error.message}`);
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success("Signed in successfully. Welcome back!");
      
    } catch (error: any) {
      toast.error(`Sign in failed: ${error.message}`);
      throw error;
    }
  },

  signInWithPhone: async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      
      if (error) throw error;
      
      toast.success("Verification code sent. Please check your phone.");
      
    } catch (error: any) {
      toast.error(`Phone sign in failed: ${error.message}`);
      throw error;
    }
  },

  verifyOTP: async (phone: string, otp: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });
      
      if (error) throw error;
      
      toast.success("Phone verified successfully. Welcome to DwellSpace!");
      
    } catch (error: any) {
      toast.error(`Verification failed: ${error.message}`);
      throw error;
    }
  },

  signOut: async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(`Sign out failed: ${error.message}`);
      throw error;
    }
  }
};
