import { auth, requestNotificationPermission } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const authService = {
  signUp: async (email: string, password: string, displayName: string, role: string = "buyer", agency: string = "", licenseNumber: string = "") => {
    try {
      // Get base URL - ensure it's the absolute URL including protocol
      const baseUrl = window.location.origin;
      
      console.log("Starting Supabase signup process for:", email);
      console.log("Using redirect URL:", baseUrl);
      console.log("User role:", role);
      
      // Validate role value to ensure it matches the user_role enum in database
      const validRoles = ["buyer", "seller", "agent", "admin"];
      if (!validRoles.includes(role)) {
        console.error("Invalid role provided:", role);
        throw new Error("Invalid user role selected");
      }
      
      // Prepare user metadata including role and agency if applicable
      const userMetadata: Record<string, any> = {
        first_name: displayName.split(' ')[0],
        last_name: displayName.split(' ').slice(1).join(' '),
        role: role,
      };
      
      // Only add agency field if role is agent (required) or seller (optional) and agency is provided
      if ((role === 'agent' || (role === 'seller' && agency.trim())) && agency) {
        userMetadata.agency = agency;
      }
      
      // Add license number for agents
      if (role === 'agent' && licenseNumber) {
        userMetadata.license_number = licenseNumber;
      }
      
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
        
        // Check if it's a rate limit error
        if (error.message && error.message.includes("rate limit exceeded")) {
          throw error; // Let the caller handle the rate limit error
        }
        
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
        toast.error("There was an issue with your information. Please verify your role and try again.");
      } else if (error.message && error.message.includes("user_role")) {
        toast.error("There was an issue with your selected role. Please try again.");
      } else if (error.message && error.message.includes("duplicate key value")) {
        toast.error("An account with this email already exists. Please sign in instead.");
      } else {
        toast.error(`Sign up failed: ${error.message}`);
      }
      
      throw error;
    }
  },

  sendEmailConfirmation: async (email: string) => {
    try {
      console.log("Sending confirmation email to:", email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmation`
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
