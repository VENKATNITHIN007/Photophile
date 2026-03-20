import bcrypt from "bcrypt";
import ApiError from "../core/ApiError";
import { ERRORS } from "../../constants/error";

export const isPasswordStrong = (password: string) => {
  if (password.length < 8) {
    throw new ApiError(409, ERRORS.AUTH.PASSWORD_LENGTH);
  }

  if (!/[A-Z]/.test(password)) {
    throw new ApiError(409, ERRORS.AUTH.PASSWORD_UPPERCASE);
  }

  if (!/[a-z]/.test(password)) {
    throw new ApiError(409, ERRORS.AUTH.PASSWORD_LOWERCASE);
  }

  if (!/\d/.test(password)) {
    throw new ApiError(409, ERRORS.AUTH.PASSWORD_NUMBER);
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new ApiError(409, ERRORS.AUTH.PASSWORD_SPECIAL);
  }

};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};