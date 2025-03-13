
import React, { createContext } from "react";
import { User } from "firebase/auth";
import { Session } from "@supabase/supabase-js";
import { AuthContextType } from "./types";

// Create the context with default values
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider will be defined in AuthProvider.tsx
