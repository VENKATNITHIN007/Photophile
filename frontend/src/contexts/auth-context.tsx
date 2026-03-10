"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export type UserRole = "user" | "photographer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isEmailVerified: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  checkEmailVerification: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const response = await apiClient.get<{ data: User }>("/users/me");
      const userData = response.data.data || (response.data as unknown as User);
      setUser(userData);
      setIsEmailVerified(userData.isEmailVerified ?? false);
    } catch {
      setUser(null);
      setIsEmailVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) {
      throw new Error("User email not available");
    }
    await apiClient.post("/users/verify-email/send", { email: user.email });
  };

  const checkEmailVerification = async (): Promise<boolean> => {
    try {
      const response = await apiClient.get<{ data: User }>("/users/me");
      const userData = response.data.data || (response.data as unknown as User);
      const verified = userData.isEmailVerified ?? false;
      setIsEmailVerified(verified);
      setUser(userData);
      return verified;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    await apiClient.post("/users/login", credentials);
    await checkAuth();
    router.push("/dashboard");
  };

  const register = async (userData: RegisterData) => {
    await apiClient.post("/users/register", userData);
    await checkAuth();
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await apiClient.post("/users/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      setIsEmailVerified(false);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isEmailVerified, login, register, logout, checkAuth, resendVerificationEmail, checkEmailVerification }}>
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
