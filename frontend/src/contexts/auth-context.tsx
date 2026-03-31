"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  sendVerificationEmail,
} from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import type {
  BackendUser,
  LoginCredentials,
  RegisterData,
  User,
} from "@/lib/types/auth";

export type { LoginCredentials, RegisterData, User, UserRole } from "@/lib/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isEmailVerified: boolean;
  login: (credentials: LoginCredentials, redirectTo?: string) => Promise<void>;
  register: (userData: RegisterData, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  checkEmailVerification: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeUser = (rawUser: BackendUser): User => {
  return {
    id: rawUser._id || rawUser.id || "",
    name: rawUser.fullName || rawUser.name || "",
    email: rawUser.email,
    role: rawUser.role,
    avatar: rawUser.avatar,
    phoneNumber: rawUser.phoneNumber,
    isEmailVerified: rawUser.isEmailVerified,
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const rawUserData = (await getCurrentUser()) as BackendUser;
      const userData = normalizeUser(rawUserData);
      setUser(userData);
      setIsEmailVerified(userData.isEmailVerified ?? false);
    } catch {
      setUser(null);
      setIsEmailVerified(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const resendVerificationEmail = async () => {
    if (!user?.email) {
      throw new Error("User email not available");
    }
    await sendVerificationEmail(user.email);
  };

  const checkEmailVerification = async (): Promise<boolean> => {
    try {
      const rawUserData = (await getCurrentUser()) as BackendUser;
      const userData = normalizeUser(rawUserData);
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
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials, redirectTo = "/dashboard") => {
    await loginUser(credentials);
    await checkAuth();
    router.push(redirectTo);
  };

  const register = async (userData: RegisterData, redirectTo = "/dashboard") => {
    await registerUser(userData);
    await checkAuth();
    router.push(redirectTo);
  };

  const logout = async () => {
    try {
      await logoutUser();
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
