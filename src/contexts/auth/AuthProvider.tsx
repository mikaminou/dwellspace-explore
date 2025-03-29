import React, { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { Session } from "@supabase/supabase-js";
import { auth, requestNotificationPermission } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { authService } from "./authService";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set isLoaded to true immediately
    setIsLoaded(true);

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
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
    });
    
    return () => {
      unsubscribeFirebase();
      authSubscription.unsubscribe();
    };
  }, []);
  
  const value = {
    currentUser,
    session,
    isLoaded,
    signUp: authService.signUp,
    createProfile: authService.createProfile,
    signIn: authService.signIn,
    signInWithPhone: authService.signInWithPhone,
    verifyOTP: authService.verifyOTP,
    signOut: authService.signOut,
    sendEmailConfirmation: authService.sendEmailConfirmation,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
