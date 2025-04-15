
import { User } from "firebase/auth";
import { Session } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

// Define UserRole type directly since we're not using the database enum yet
export type UserRole = Database["public"]["Enums"]["user_role"];

export interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  isLoaded: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ user: any, session: any } | undefined>;
  createProfile: (userId: string, profileData: {
    first_name: string;
    last_name: string;
    role: string;
    agency?: string;
    license_number?: string;
    phone_number?: string;
    bio?: string;
  }) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  // Add the missing sendEmailConfirmation method
  sendEmailConfirmation: (email: string, role: string) => Promise<boolean>;
}
