"use client";

import { useSession as useNextAuthSession, signIn, signOut } from "next-auth/react";
import type { Role } from "@prisma/client";
import { hasRole, hasRoleLevel, roleHierarchy } from "@/lib/auth";

interface UseSessionReturn {
  // Session data
  user: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
    bankId: string | null;
    phone: string | null;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Role checking
  hasRole: (requiredRoles: Role[]) => boolean;
  hasRoleLevel: (minimumRole: Role) => boolean;
  roleLevel: number;
  
  // Auth actions
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

export function useSession(): UseSessionReturn {
  const { data: session, status } = useNextAuthSession();

  const user = session?.user ?? null;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // Get the role level for the current user
  const roleLevel = user ? roleHierarchy[user.role] : 0;

  // Check if user has specific role(s)
  const checkRole = (requiredRoles: Role[]): boolean => {
    if (!user) return false;
    return hasRole(user.role, requiredRoles);
  };

  // Check if user has at least a certain role level
  const checkRoleLevel = (minimumRole: Role): boolean => {
    if (!user) return false;
    return hasRoleLevel(user.role, minimumRole);
  };

  // Login function
  const handleSignIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  };

  // Logout function
  const handleSignOut = async (): Promise<void> => {
    await signOut({ redirect: false });
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    hasRole: checkRole,
    hasRoleLevel: checkRoleLevel,
    roleLevel,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}

// Export role types for convenience
export type { Role };
