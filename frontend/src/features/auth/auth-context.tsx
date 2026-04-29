"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types/auth";
import { useCurrentUserQuery, useLogoutMutation } from "./auth.queries";

export type { User, UserRole } from "@/lib/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isEmailVerified: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: userData, isLoading } = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const user = userData ?? null;
  const loading = isLoading;
  const isEmailVerified = user?.isEmailVerified ?? false;

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
    } finally {
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isEmailVerified, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
