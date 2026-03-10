import { Router } from "express";
import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
  refreshAccessToken,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { LoginSchema, RegisterSchema, UpdateProfileSchema, ForgotPasswordSchema, ResetPasswordSchema, VerifyEmailSchema } from "../validations/auth.validation";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authRateLimiter, emailVerificationLimiter, forgotPasswordLimiter, apiRateLimiter } from "../middlewares/rateLimiter.middleware";

const userRouter = Router();

// Public routes with stricter rate limiting for auth endpoints
userRouter
  .post("/login", authRateLimiter, validateRequest(LoginSchema), loginUser)
  .post(
    "/register",
    authRateLimiter,
    validateRequest(RegisterSchema),
    registerUser,
  )
  .post("/refresh-token", refreshAccessToken)
  .post("/verify-email/send", emailVerificationLimiter, sendVerificationEmail)
  .post("/verify-email", apiRateLimiter, validateRequest(VerifyEmailSchema), verifyEmail)
  .post("/forgot-password", forgotPasswordLimiter, validateRequest(ForgotPasswordSchema), forgotPassword)
  .post("/reset-password", apiRateLimiter, validateRequest(ResetPasswordSchema), resetPassword);

// Protected routes
userRouter
  .use(authMiddleware)
  .get("/me", currentUser)
  .post("/logout", logoutUser)
  .put("/profile", validateRequest(UpdateProfileSchema), updateProfile);

export default userRouter;
