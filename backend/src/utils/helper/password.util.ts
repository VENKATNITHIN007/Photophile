import bcrypt from "bcrypt";
import ApiError from "../ApiError";

export const isPasswordStrong = (password: string) => {
  if (password.length < 8) {
    throw new ApiError(409, "Password length must be 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    throw new ApiError(409, "Password must have one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    throw new ApiError(409, "Password must have one lowercase letter");
  }

  if (!/\d/.test(password)) {
    throw new ApiError(409, "Password must have one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new ApiError(409, "Password must have one special character");
  }

};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};