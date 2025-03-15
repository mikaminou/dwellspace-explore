
import React, { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { Session } from "@supabase/supabase-js";
import { auth, requestNotificationPermission } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { authService } from "./authService";
import { toast } from "@/components/ui/use-toast";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribeFirebase = () => {};
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initAuth = async () => {
      try {
        // Firebase auth state for notifications
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
        const { data } = await supabase.auth.getSession();
        console.log("Initial auth session:", data.session ? "Present" : "None");
        setSession(data.session);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("Auth state changed:", event, session ? "Present" : "None");
            setSession(session);
            setIsLoaded(true);
          }
        );
        
        authSubscription = subscription;
        setIsLoaded(true);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthError(error instanceof Error ? error : new Error(String(error)));
        setIsLoaded(true); // Mark as loaded even on error
        
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem initializing authentication. Some features may not work correctly.",
        });
      }
    };

    initAuth();
    
    return () => {
      unsubscribeFirebase();
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);
  
  // If there was an auth error but we can provide a degraded experience
  if (authError) {
    console.warn("Using degraded auth experience due to error:", authError);
  }
  
  const value = {
    currentUser,
    session,
    isLoaded,
    signUp: authService.signUp,
    signIn: authService.signIn,
    signInWithPhone: authService.signInWithPhone,
    verifyOTP: authService.verifyOTP,
    signOut: authService.signOut,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
