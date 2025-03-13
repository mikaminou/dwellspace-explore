
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth, requestNotificationPermission } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  isLoaded: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Firebase auth state for notifications
    const unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
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
    
    // Supabase auth state
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setIsLoaded(true);
      }
    );
    
    return () => {
      unsubscribeFirebase();
      authSubscription.unsubscribe();
    };
  }, []);
  
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: displayName.split(' ')[0],
            last_name: displayName.split(' ').slice(1).join(' '),
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created successfully",
        description: "Welcome to DwellSpace!",
      });
      
      return data;
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
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      // For Firebase notifications
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      
      // For Supabase auth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
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
      
      // Also sign out from Firebase
      await auth.signOut();
      
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
    signInWithGoogle,
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
