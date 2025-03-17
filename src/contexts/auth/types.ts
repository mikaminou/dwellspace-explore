
import { User } from "firebase/auth";
import { Session } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

// Use the enum type from Supabase
export type UserRole = Database["public"]["Enums"]["user_role"];

export interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  isLoaded: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ confirmationRequired?: boolean } | undefined>;
  createProfile: (userId: string, role: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
}
