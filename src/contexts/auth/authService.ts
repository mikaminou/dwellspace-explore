
import { auth, requestNotificationPermission } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const authService = {
  signUp: async (email: string, password: string, displayName: string, role: string = "buyer") => {
    try {
      // Get base URL - ensure it's the absolute URL including protocol
      const baseUrl = window.location.origin;
      
      console.log("Starting Supabase signup process for:", email);
      console.log("Using redirect URL:", baseUrl);
      
      // Sign up with proper redirect URL
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: displayName.split(' ')[0],
            last_name: displayName.split(' ').slice(1).join(' '),
            role: role,
          },
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
      
      // Check if email confirmation is required
      const confirmationRequired = data.user?.identities && data.user.identities.length === 0;
      
      if (confirmationRequired) {
        console.log("Email confirmation required for:", email);
        toast({
          title: "Confirmation email sent",
          description: "Please check your inbox to confirm your email address.",
        });
        return { confirmationRequired: true };
      } else {
        console.log("User created without confirmation requirement");
        toast({
          title: "Account created successfully",
          description: "Welcome to DwellSpace!",
        });
        return undefined;
      }
      
    } catch (error: any) {
      console.error("Full signup error:", error);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  },

  signInWithPhone: async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
      });
      
    } catch (error: any) {
      toast({
        title: "Phone sign in failed",
        description: error.message,
        variant: "destructive",
      });
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
      
      toast({
        title: "Phone verified successfully",
        description: "Welcome to DwellSpace!",
      });
      
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
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
      
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }
};
