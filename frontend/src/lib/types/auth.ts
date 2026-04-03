export type UserRole = "user" | "photographer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  phoneNumber?: string;
  isEmailVerified?: boolean;
}

export interface BackendUser {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  phoneNumber?: string;
  isEmailVerified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}
