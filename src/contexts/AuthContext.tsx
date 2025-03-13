
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged
} from "firebase/auth";
import { auth, requestNotificationPermission } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  isLoaded: boolean;
  signUp: (email: string, password: string, displayName: string, role?: string) => Promise<{ confirmationRequired?: boolean } | undefined>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Firebase auth state for notifications
    let unsubscribeFirebase = () => {};
    
    // Only attempt to use Firebase if it's properly initialized (auth has onAuthStateChanged)
    if (auth && typeof auth.onAuthStateChanged === 'function') {
      unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        
        // Request notification permission when user is authenticated
        if (user) {
          requestNotificationPermission().then(token => {
            if (token) {
              console.log("Notification token registered:", token);
            }
          });
        }
      });
    } else {
      console.warn("Firebase auth not fully initialized, notifications may not work");
      setCurrentUser(null);
    }
    
    // Supabase auth state
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event, session);
        setSession(session);
        setIsLoaded(true);
      }
    );
    
    return () => {
      unsubscribeFirebase();
      authSubscription.unsubscribe();
    };
  }, []);
  
  const signUp = async (email: string, password: string, displayName: string, role: string = "buyer") => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: displayName.split(' ')[0],
            last_name: displayName.split(' ').slice(1).join(' '),
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/email-confirmation?type=signup`
        }
      });
      
      if (error) throw error;
      
      // Check if email confirmation is required
      const confirmationRequired = data.user?.identities && data.user.identities.length === 0;
      
      if (confirmationRequired) {
        toast({
          title: "Confirmation email sent",
          description: "Please check your inbox to confirm your email address.",
        });
        return { confirmationRequired: true };
      } else {
        toast({
          title: "Account created successfully",
          description: "Welcome to DwellSpace!",
        });
        return undefined;
      }
      
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const signIn = async (email: string, password: string) => {
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
  };

  const signInWithPhone = async (phone: string) => {
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
  };

  const verifyOTP = async (phone: string, otp: string) => {
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
  };
  
  const signOut = async () => {
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
  };
  
  const value = {
    currentUser,
    session,
    isLoaded,
    signUp,
    signIn,
    signInWithPhone,
    verifyOTP,
    signOut,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
