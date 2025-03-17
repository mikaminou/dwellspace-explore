
import { auth, requestNotificationPermission } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

// Define valid role types matching the database enum
type UserRole = Database["public"]["Enums"]["user_role"];
const validRoles: UserRole[] = ["buyer", "seller", "agent", "admin"];

// Function to validate roles
const validateRole = (role: string): UserRole => {
  if (validRoles.includes(role as UserRole)) {
    return role as UserRole;
  }
  return "buyer"; // Default to buyer if invalid role
};

export const authService = {
  signUp: async (email: string, password: string, displayName: string) => {
    try {
      // Get base URL - ensure it's the absolute URL including protocol
      const baseUrl = window.location.origin;
      
      console.log("Starting Supabase signup process for:", email);
      console.log("Using redirect URL:", baseUrl);
      
      // Prepare user metadata without role
      const userMetadata: Record<string, any> = {
        first_name: displayName.split(' ')[0],
        last_name: displayName.split(' ').slice(1).join(' '),
        // No role yet - will be set during confirmation
      };
      
      console.log("User metadata being sent:", userMetadata);
      console.log("User email being sent:", email);
      
      // Sign up with deferred email verification (no email sent yet)
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: `${baseUrl}/email-confirmation`
        }
      });
      
      if (error) {
        console.error("Supabase signup error:", error);
        throw error;
      }
      
      console.log("Supabase signup response:", data);
      
      // Check if user was created successfully
      if (data.user) {
        console.log("User created successfully:", email);
        toast.success("Account created successfully. Please verify your email.");
        return { user: data.user, confirmationRequired: true };
      } else {
        console.log("Something went wrong with signup");
        toast.error("Something went wrong during signup. Please try again.");
        return { confirmationRequired: true };
      }
      
    } catch (error: any) {
      console.error("Full signup error:", error);
      
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

  sendEmailConfirmation: async (email: string, role: string) => {
    try {
      console.log("Sending confirmation email to:", email);
      console.log("Selected role:", role);
      
      // Validate role
      const validatedRole = validateRole(role);
      
      // Store the selected role in local storage for later
      localStorage.setItem('user_selected_role', validatedRole);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmation?role=${encodeURIComponent(validatedRole)}`
        }
      });
      
      if (error) throw error;
      
      toast.success("Verification email sent. Please check your inbox.");
      return { success: true };
      
    } catch (error: any) {
      console.error("Error sending confirmation email:", error);
      toast.error(`Failed to send verification email: ${error.message}`);
      throw error;
    }
  },

  createProfile: async (userId: string, role: string) => {
    try {
      console.log("Creating profile for user:", userId);
      console.log("With role:", role);
      
      // Validate role before saving to database
      const validatedRole = validateRole(role);
      
      // Get the user's metadata from the auth
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const firstName = userData.user.user_metadata.first_name || '';
      const lastName = userData.user.user_metadata.last_name || '';
      const email = userData.user.email;
      
      // Check if profile already exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileCheckError && !profileCheckError.message.includes('No rows found')) {
        throw profileCheckError;
      }
      
      if (existingProfile) {
        console.log("Profile already exists, updating role");
        // Update the existing profile with the selected role
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: validatedRole })
          .eq('id', userId);
          
        if (updateError) throw updateError;
      } else {
        console.log("Creating new profile");
        // Insert a new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email,
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
      
      // Also sign out from Firebase if it's initialized
      if (auth && typeof auth.signOut === 'function') {
        try {
          await auth.signOut();
        } catch (error) {
          console.warn("Firebase sign out failed:", error);
        }
      }
      
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(`Sign out failed: ${error.message}`);
      throw error;
    }
  }
};
